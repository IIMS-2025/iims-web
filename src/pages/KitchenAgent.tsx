import React, { useState, useRef, useEffect } from 'react';
import '../styles/kitchenAgent.css';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const KitchenAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your Kitchen AI Assistant. I can help you with inventory, menu, and cost analysis. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'stock-analysis',
      title: 'Stock Analysis',
      description: 'Check inventory levels',
      icon: '📊',
      color: '#3B82F6'
    },
    {
      id: 'menu-insights',
      title: 'Menu Insights',
      description: 'Optimize menu items',
      icon: '🍽️',
      color: '#3B82F6'
    },
    {
      id: 'low-stock-alert',
      title: 'Low Stock Alert',
      description: 'View critical items',
      icon: '⚠️',
      color: '#EF4444'
    },
    {
      id: 'ai-forecast',
      title: 'AI Forecast',
      description: 'Predict demand',
      icon: '⭐',
      color: '#10B981'
    }
  ];

  const quickResponses = [
    'Revenue today',
    'Wastage report',
    'Menu optimization',
    'Stock levels',
    'Cost analysis'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputText),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('stock') || lowerInput.includes('inventory')) {
      return "I can help you with stock analysis! Here's what I found:\n\n• Total items: 247\n• Low stock items: 12\n• Critical items: 3\n• Items expiring soon: 8\n\nWould you like me to show you the critical items that need immediate attention?";
    }
    
    if (lowerInput.includes('revenue') || lowerInput.includes('sales')) {
      return "Today's revenue analysis:\n\n💰 Revenue: $2,847\n📈 vs Yesterday: +12%\n🥗 Top seller: Caesar Salad\n⏰ Peak time: 12:30-1:30 PM\n\nWould you like a detailed breakdown by menu category?";
    }
    
    if (lowerInput.includes('menu') || lowerInput.includes('optimize')) {
      return "Menu optimization insights:\n\n🔥 High performers: Margherita Pizza, Grilled Salmon\n⚠️ Underperforming: Buffalo Wings\n💡 Suggestion: Consider seasonal specials\n📊 Profit margin leader: Classic Tiramisu\n\nShould I create a detailed menu performance report?";
    }
    
    if (lowerInput.includes('waste') || lowerInput.includes('wastage')) {
      return "Wastage report for today:\n\n🗑️ Total waste: 8.2 kg\n💸 Cost impact: $127\n📉 vs Yesterday: -15%\n🥬 Most wasted: Lettuce (2.1 kg)\n\nTip: Consider smaller portion prep for lettuce-based items.";
    }
    
    return "I understand you're asking about: \"" + input + "\"\n\nI can help you with:\n• Inventory management\n• Menu analysis\n• Cost optimization\n• Revenue insights\n• Waste reduction\n\nCould you be more specific about what you'd like to know?";
  };

  const handleQuickAction = (action: QuickAction) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: action.title,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(action.title),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickResponse = (response: string) => {
    setInputText(response);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="kitchen-agent m-4">
      <div className="chat-container">
        <div className="messages-area">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.type === 'assistant' && (
                  <div className="message-avatar">
                    🤖
                  </div>
                )}
                <div className="message-bubble">
                  <div className="message-text">
                    {message.content.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < message.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message assistant">
              <div className="message-content">
                <div className="message-avatar">
                  🤖
                </div>
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="quick-actions">
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={action.id}
                  className={`user-guide-kitchen-agent-quick-actions${index + 1} quick-action-card`}
                  onClick={() => handleQuickAction(action)}
                >
                  <div className="action-icon" style={{ color: action.color }}>
                    {action.icon}
                  </div>
                  <div className="action-content">
                    <div className="action-title">{action.title}</div>
                    <div className="action-description">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Responses */}
        <div className="quick-responses">
          <div className="quick-responses-scroll">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                className="quick-response-chip"
                onClick={() => handleQuickResponse(response)}
              >
                {response}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about inventory, menu, costs"
              className="message-input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M18 2L9 11L6 8L18 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 2L13 18L9 11L18 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenAgent;
