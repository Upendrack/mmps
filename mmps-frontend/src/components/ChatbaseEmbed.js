import { useEffect } from 'react';

const ChatbaseEmbed = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.chatbase.co/chatbot-embed.js";
        script.setAttribute("chatbotId", "psnum95ejauic7vvrs64irygs6y44hzu"); // Replace with actual ID
        script.async = true; // Ensures it loads without blocking other elements
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Cleanup on unmount
        };
    }, []);

    return null; // Injects the chatbot silently
};

export default ChatbaseEmbed;