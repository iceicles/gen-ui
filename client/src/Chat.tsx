import { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ProductItem, type ProductDetails } from './ProductItem';
import { Form } from './Form';

export function Chat() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4000/api/chat',
    }),
  });

  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // tracks whether to follow the latest message or not
  // if false, the user is reading older messages and the view should not automatically scroll to the latest message
  const followLatestRef = useRef(true);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const container = messagesRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const observer = new ResizeObserver(() => {
      if (followLatestRef.current) {
        // set container scrollTop position to its total height
        container.scrollTop = container.scrollHeight;
        lastScrollTopRef.current = container.scrollTop;
      }
    });
    observer.observe(content);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const atBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      24; // 24 here is just a buffer
    if (atBottom) {
      // user has scrolled to the bottom, so we should follow the latest message
      followLatestRef.current = true;
    } else if (container.scrollTop < lastScrollTopRef.current) {
      // user has scrolled up, so we should stop following the latest message
      followLatestRef.current = false;
    }
    lastScrollTopRef.current = container.scrollTop;
  };

  const handleSendMessage = (message: { text: string }) => {
    followLatestRef.current = true;
    return sendMessage(message);
  };

  return (
    <>
      <div
        className="chat__messages"
        ref={messagesRef}
        role="log"
        aria-label="Conversation"
        onScroll={handleScroll}
      >
        <div className="chat__content" ref={contentRef}>
          {messages.map((m) => (
            <div className="chat__message" key={m.id}>
              {m.parts.map((part, i) => {
                if (part.type === 'text') {
                  return (
                    <p
                      style={
                        m.role === 'user'
                          ? {
                              padding: '0 5px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                            }
                          : undefined
                      }
                      key={i}
                    >
                      {part.text}
                    </p>
                  );
                }

                if (part.type === 'tool-showProducts') {
                  switch (part.state) {
                    case 'input-streaming':
                    case 'input-available':
                      return <div key={i}>Loading products...</div>;
                    case 'output-available':
                      return (
                        <ProductItem
                          key={i}
                          products={part.output as ProductDetails[]}
                        />
                      );
                    case 'output-error':
                      return <div key={i}>Error: {part.errorText} </div>;
                  }
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>
      <Form sendMessage={handleSendMessage} setInput={setInput} input={input} />
    </>
  );
}
