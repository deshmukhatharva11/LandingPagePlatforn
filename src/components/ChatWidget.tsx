import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, User, Sparkles, Loader2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OpenAI from 'openai';
import { KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { sendChatLead } from '../utils/emailjs';
import { dispatchAICommand } from '../utils/aiActions';

// --- Configuration ---
// Key is injected at build time from VITE_OPENROUTER_API_KEY (.env.local for local dev,
// platform env vars on deploy). Never hardcode it: the repo is public and GitHub push
// protection blocks committing the key.
const API_KEY = "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";
const WHATSAPP_LINK = "https://wa.me/919423640903"; // MR Traders WhatsApp

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: API_KEY || 'placeholder_key',
    dangerouslyAllowBrowser: true, // Required for client-side usage
});

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: Date;
}

const ChatWidget: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            text: "Hi there! I'm MIRA from MR Traders Nashik 👋 How can I help you with your interior design plans today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [leadCaptured, setLeadCaptured] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Lead Capture Logic: Check for phone numbers in user messages
    useEffect(() => {
        if (leadCaptured) return; // Don't capture twice in a session

        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'user') {
            // Regex for Indian mobile numbers (allows spaces/dashes, +91 optional)
            const phoneRegex = /(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}/;
            const match = lastMessage.text.match(phoneRegex);

            if (match) {
                const phoneNumber = match[0];
                const transcript = messages.map(m => `${m.role}: ${m.text}`).join('\n');
                console.log("Lead Detected:", phoneNumber);

                // Send to EmailJS
                sendChatLead(phoneNumber, transcript);
                setLeadCaptured(true);
            }
        }
    }, [messages, leadCaptured]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        if (!API_KEY) {
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        role: 'assistant',
                        text: "Hi! I'm currently experiencing connection issues, but I'd love to help you! Please click the WhatsApp button at the top to chat with us directly, or call/WhatsApp us at +91 9423640903.",
                        timestamp: new Date(),
                    },
                ]);
                setIsLoading(false);
            }, 800);
            return;
        }

        try {
            const completion = await client.chat.completions.create({
                model: "deepseek/deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: `You are MIRA, a friendly and knowledgeable interior design consultant at MR Traders, Nashik.

**About MR Traders**:
- Premium interior design studio and factory outlet in Nashik
- Address: Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka, Nashik-422003
- Phone/WhatsApp: +91 9423640903
- Email: mrtradersofficial01@gmail.com
- Instagram: @mr_traders.10
- 1000+ projects delivered across Nashik
- Factory outlet means clients get premium materials at wholesale prices directly with no middlemen

**Services we offer**: Living room design, modular kitchen, bedroom interiors, bathroom design, false ceiling, wallpaper, flooring, full home interiors, office interiors.

**Your Goal**: Help visitors with interior design queries and capture leads for WhatsApp follow-up.

**Key Guidelines**:
1. Be warm, friendly, and natural. Use emojis sparingly.
2. Consultative: Ask 1-2 probing questions before giving advice (Which room? What style? What budget?).
3. NO MARKDOWN. Plain text only. No bold or headers.
4. Mention the factory outlet advantage (direct pricing, no middlemen, premium quality).
5. Always offer a FREE consultation.
6. STRICT BOUNDARY: You MUST ONLY answer questions related to interior design, furniture, architecture, and MR Traders services. If a user asks about anything else (e.g. general knowledge, math, politics, programming), you MUST politely decline and steer the conversation back to interior design and MR Traders.

**WHATSAPP LEAD STRATEGY**:
- Your primary goal is to get their WhatsApp number.
- Say things like: "I can share our project portfolio and price guide on WhatsApp - what's your number?"
- Or: "Let me send you some photos of our latest Nashik projects on WhatsApp. What's your number?"
- Build rapport first, then ask for the number.
- WhatsApp link: ${WHATSAPP_LINK}

**Behavior**:
- For price queries: general range ₹800-2500 per sq ft for interiors depending on finish level. Exact quotes need site visit.
- If unsure: "Let me connect you with our design team on WhatsApp for accurate details. What's your number?"
- Always be positive, helpful, and professional.`
                    },
                    ...messages
                        .filter(m => m.id !== 'welcome')
                        .map(m => ({
                            role: m.role,
                            content: m.text
                        })),
                    {
                        role: "user",
                        content: userMessage.text
                    }
                ],
            }, {
                headers: {
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "MR Traders Website",
                }
            });

            const text = completion.choices[0]?.message?.content || "I couldn't generate a response.";

            // Parse for commands
            const commandRegex = /<<<COMMAND:\s*({.*?})>>>/s;
            const commandMatch = text.match(commandRegex);

            let cleanText = text;

            if (commandMatch) {
                try {
                    const commandJson = JSON.parse(commandMatch[1]);
                    console.log("AI Command Received:", commandJson);

                    // Execute Navigation directly
                    if (commandJson.type === 'NAVIGATE') {
                        navigate(commandJson.payload.path);
                    }

                    // Dispatch other events
                    dispatchAICommand(commandJson);

                    // Remove command from visible text
                    cleanText = text.replace(commandRegex, '').trim();
                    if (!cleanText) cleanText = "I've started that for you!";
                } catch (e) {
                    console.error("Failed to parse AI command:", e);
                }
            }

            // Remove markdown symbols (**, ###) from the response strictly
            cleanText = cleanText.replace(/\*\*/g, '').replace(/###/g, '').replace(/`/g, '');

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: cleanText,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error: any) {
            console.error('OpenAI/OpenRouter Error:', error);

            let userFriendlyError = "I'm having trouble connecting.";
            if (error?.status === 401) {
                userFriendlyError = "Authentication Error. Please check API Key.";
            } else if (error?.status === 402) {
                userFriendlyError = "Credits Expired. Please top up your OpenRouter account.";
            } else if (error?.status === 429) {
                userFriendlyError = "Too many requests. Please try again later.";
            } else {
                userFriendlyError = `Connection Error: ${error.message || 'Unknown error'}`;
            }

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                text: userFriendlyError,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMessageText = (text: string) => {
        // Regex to capture URLs. Note: simple regex, might catch trailing punctuation.
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                // Clean trailing punctuation that might have been captured
                let cleanUrl = part;
                let suffix = '';
                const punctuationMatch = part.match(/[.,!?)]+$/);

                if (punctuationMatch) {
                    suffix = punctuationMatch[0];
                    cleanUrl = part.slice(0, -suffix.length);
                }

                if (cleanUrl.includes('wa.me') || cleanUrl.includes('whatsapp.com')) {
                    return (
                        <span key={index} className="inline-flex items-center">
                            <a
                                href={cleanUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold transition-colors mx-1 no-underline"
                            >
                                <Phone className="w-3 h-3" />
                                WhatsApp Us
                            </a>
                            {suffix}
                        </span>
                    );
                }
                return (
                    <span key={index}>
                        <a
                            href={cleanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary-600 hover:underline break-all"
                        >
                            {cleanUrl}
                        </a>
                        {suffix}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden pointer-events-auto flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-secondary-600 to-secondary-700 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">MIRA</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-secondary-100 text-xs text-medium">MR Traders Support</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={WHATSAPP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-white hover:bg-gray-50 text-secondary-700 rounded-full transition-colors flex items-center gap-1.5 shadow-md font-bold"
                                    title="Chat on WhatsApp"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span className="text-xs whitespace-nowrap">WhatsApp</span>
                                </a>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 text-white rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950/50 scroll-smooth">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${message.role === 'user'
                                            ? 'bg-secondary-600 text-white rounded-tr-none'
                                            : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                            }`}
                                    >
                                        <div className="markdown-body whitespace-pre-wrap font-sans">
                                            {formatMessageText(message.text)}
                                        </div>
                                        <span className={`text-[10px] mt-1 block opacity-70 ${message.role === 'user' ? 'text-secondary-100' : 'text-gray-400'}`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-secondary-600" />
                                        <span className="text-xs text-gray-500">Typing...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500/50 placeholder-gray-500 transition-all border-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 p-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50 disabled:hover:bg-secondary-600 transition-colors shadow-md"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-gray-400">MR Traders Support • Always happy to help</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto p-4 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all relative group"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <X key="close" className="w-7 h-7" />
                    ) : (
                        <MessageCircle key="open" className="w-7 h-7" />
                    )}
                </AnimatePresence>

                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 whitespace-nowrap hidden group-hover:block"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Chat with MIRA</span>
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white dark:bg-slate-800 transform rotate-45 border-r border-t border-gray-100 dark:border-gray-700"></div>
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
