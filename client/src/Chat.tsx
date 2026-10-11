import { useState } from 'react';
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

  return (
    <>
      {messages.map((m) => (
        <div key={m.id}>
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
                  return <div>Loading products...</div>;
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
      <Form sendMessage={sendMessage} setInput={setInput} input={input} />
    </>
  );
}
