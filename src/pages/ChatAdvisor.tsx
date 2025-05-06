import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Image, 
  File, 
  X, 
  User, 
  Loader2,
  Download,
  Calendar,
  Clock,
  Phone
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  isAppointment?: boolean;
  appointmentDetails?: {
    date: string;
    time: string;
    advisor: string;
  };
}

export default function ChatAdvisor() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour, je suis Sophie, votre conseillère en assurance voyage. Comment puis-je vous aider aujourd'hui ?",
      sender: 'advisor',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [advisorImage, setAdvisorImage] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150');

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        name: file.name
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setAttachments([]);
    setIsTyping(true);

    // Simulate advisor response
    setTimeout(() => {
      let advisorResponse: Message;

      if (message.toLowerCase().includes('rendez-vous') || message.toLowerCase().includes('appel')) {
        advisorResponse = {
          id: (Date.now() + 1).toString(),
          text: "Je serais ravie de planifier un appel avec vous pour discuter de vos besoins en assurance voyage. Voici un créneau disponible :",
          sender: 'advisor',
          timestamp: new Date(),
          isAppointment: true,
          appointmentDetails: {
            date: '15 avril 2024',
            time: '14:30',
            advisor: 'Sophie Martin'
          }
        };
      } else if (message.toLowerCase().includes('document') || message.toLowerCase().includes('attestation')) {
        advisorResponse = {
          id: (Date.now() + 1).toString(),
          text: "Voici l'attestation d'assurance que vous avez demandée. Vous pouvez la télécharger en cliquant sur le document ci-dessous.",
          sender: 'advisor',
          timestamp: new Date(),
          attachments: [
            {
              type: 'document',
              url: '#',
              name: 'Attestation_Assurance.pdf'
            }
          ]
        };
      } else if (message.toLowerCase().includes('expatrié') || message.toLowerCase().includes('expatriation')) {
        advisorResponse = {
          id: (Date.now() + 1).toString(),
          text: "Pour une assurance expatrié, nous proposons plusieurs formules adaptées à votre situation. Nos offres couvrent les frais médicaux, l'hospitalisation, le rapatriement et bien plus encore. Souhaitez-vous que je vous détaille les garanties spécifiques ou préférez-vous un devis personnalisé ?",
          sender: 'advisor',
          timestamp: new Date()
        };
      } else if (message.toLowerCase().includes('prix') || message.toLowerCase().includes('tarif') || message.toLowerCase().includes('coût')) {
        advisorResponse = {
          id: (Date.now() + 1).toString(),
          text: "Les tarifs de nos assurances voyage varient selon la destination, la durée et le nombre de personnes à assurer. Pour une assurance voyage classique, les prix commencent à 2,99€ par jour et par personne. Pour une assurance expatrié, les tarifs débutent à 29€ par mois. Puis-je vous aider à obtenir un devis personnalisé ?",
          sender: 'advisor',
          timestamp: new Date()
        };
      } else {
        advisorResponse = {
          id: (Date.now() + 1).toString(),
          text: "Merci pour votre message. Je suis là pour répondre à toutes vos questions concernant nos assurances voyage et expatriation. N'hésitez pas à me demander des précisions sur nos garanties, tarifs ou procédures de souscription.",
          sender: 'advisor',
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, advisorResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleAttachmentClick = (type: 'image' | 'document') => {
    setShowAttachmentOptions(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-mybakup-blue" />
            </button>
            <div className="ml-4 flex items-center gap-3">
              <img
                src={advisorImage}
                alt="Sophie Martin"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-lg font-semibold text-mybakup-blue">
                  Sophie Martin
                </h1>
                <p className="text-sm text-gray-500">
                  Conseillère en assurance
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.open('tel:+33123456789')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Phone className="w-6 h-6 text-mybakup-blue" />
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'advisor' && (
              <img
                src={advisorImage}
                alt="Sophie Martin"
                className="w-8 h-8 rounded-full object-cover mr-2 self-end"
              />
            )}
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.sender === 'user'
                ? 'bg-mybakup-blue text-white'
                : 'bg-white border border-gray-200'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.attachments.map((attachment, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded-lg flex items-center gap-2 ${
                        msg.sender === 'user'
                          ? 'bg-mybakup-blue/80 text-white'
                          : 'bg-gray-50'
                      }`}
                    >
                      {attachment.type === 'image' ? (
                        <Image className="w-5 h-5" />
                      ) : (
                        <File className="w-5 h-5" />
                      )}
                      <span className="text-sm truncate">{attachment.name}</span>
                      <button className="ml-auto">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {msg.isAppointment && msg.appointmentDetails && (
                <div className={`mt-3 p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-mybakup-blue/80 text-white'
                    : 'bg-mybakup-coral/10'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Proposition de rendez-vous</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{msg.appointmentDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{msg.appointmentDetails.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{msg.appointmentDetails.advisor}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className={`flex-1 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-white text-mybakup-blue'
                        : 'bg-mybakup-coral text-white'
                    }`}>
                      Accepter
                    </button>
                    <button className={`flex-1 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-mybakup-blue/80 text-white border border-white'
                        : 'bg-white text-mybakup-coral border border-mybakup-coral'
                    }`}>
                      Autre horaire
                    </button>
                  </div>
                </div>
              )}
              
              <p className={`text-xs mt-1 ${
                msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.sender === 'user' && (
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=150&h=150"
                alt="User"
                className="w-8 h-8 rounded-full object-cover ml-2 self-end"
              />
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <img
              src={advisorImage}
              alt="Sophie Martin"
              className="w-8 h-8 rounded-full object-cover mr-2 self-end"
            />
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {attachments.map((file, index) => (
              <div key={index} className="relative">
                {file.type.startsWith('image/') ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                    <File className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <div className="relative">
            <button
              onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Paperclip className="w-6 h-6 text-gray-500" />
            </button>
            
            {showAttachmentOptions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => handleAttachmentClick('image')}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                >
                  <Image className="w-5 h-5 text-mybakup-coral" />
                  <span>Image</span>
                </button>
                <button
                  onClick={() => handleAttachmentClick('document')}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
                >
                  <File className="w-5 h-5 text-mybakup-blue" />
                  <span>Document</span>
                </button>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
          </div>
          
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre message..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() && attachments.length === 0}
            className="p-3 bg-mybakup-coral text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}