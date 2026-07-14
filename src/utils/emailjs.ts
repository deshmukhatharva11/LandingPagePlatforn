import emailjs from '@emailjs/browser';

emailjs.init("PXDSk3fCt67GaZgoV");

export const sendEmail = async ({ template_id, service_id, user_id, template_params }: {
  template_id: string;
  service_id: string;
  user_id: string;
  template_params: Record<string, unknown>;
}) => {
  try {
    return await emailjs.send(
      service_id,
      template_id,
      template_params,
      user_id
    );
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendChatLead = async (phone: string, transcript: string) => {
  // Credentials provided by user
  const SERVICE_ID = "service_rm1c57c";
  const TEMPLATE_ID = "template_8n51p9h";
  const PUBLIC_KEY = "PXDSk3fCt67GaZgoV";

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        phone_number: phone,
        chat_transcript: transcript,
        source: "AI Chat Widget",
        date: new Date().toLocaleString()
      },
      PUBLIC_KEY
    );
    console.log("Lead sent successfully!", response.status, response.text);
    return response;
  } catch (error: any) {
    console.error("Failed to send lead:", error);
    if (error.text) console.error("EmailJS Error Text:", error.text);
    // Silent fail so we don't break the chat UI
    return null;
  }
};