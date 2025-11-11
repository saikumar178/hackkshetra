import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Upload } from 'lucide-react';
import useAuthStore from '../store/authStore';
import Button from './ui/Button';
import { Card } from './ui/Card';

export default function FloatingChatbot() {
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Only for authenticated students
  if (!isAuthenticated || (user?.role !== 'student' && user?.role !== 'both')) {
    return null;
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // ✅ Simulated AI response
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant',
        content: `You asked: "${userMessage.content}". This is a demo chatbot response.`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 900);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: `Uploaded: ${file.name}`, file: file.name },
        ]);
      }
    };
    input.click();
  };

  return (
    <>
      {/* ✅ Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-full 
                   bg-black text-white dark:bg-white dark:text-black shadow-xl 
                   hover:bg-gray-800 dark:hover:bg-gray-200"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* ✅ Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[999] w-96 max-w-full"
          >
            <Card className="flex h-[500px] flex-col bg-white dark:bg-black shadow-2xl rounded-xl border border-gray-200 dark:border-gray-800">
              
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                <h3 className="text-lg font-bold text-black dark:text-white">AI Assistant</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Ask anything about your courses
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">

                {messages.length === 0 && (
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    <p>Start a conversation with your AI tutor!</p>
                    <p className="mt-1 text-xs">Ask questions or upload a file.</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow 
                        ${
                          msg.role === 'user'
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'
                        }`}
                    >
                      {msg.content}
                      {msg.file && (
                        <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">
                          📎 {msg.file}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing animation */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-xl px-4 py-2">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 bg-black dark:bg-white rounded-full animate-bounce"></span>
                        <span className="h-2 w-2 bg-black dark:bg-white rounded-full animate-bounce delay-150"></span>
                        <span className="h-2 w-2 bg-black dark:bg-white rounded-full animate-bounce delay-300"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFileUpload}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Upload size={18} />
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 
                               px-3 py-2 text-black dark:text-white outline-none"
                  />

                  <Button size="sm" variant="primary" onClick={handleSend}>
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
