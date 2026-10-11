interface FormProps {
  sendMessage: (message: { text: string }) => void;
  input: string;
  setInput: (input: string) => void;
}

export function Form(Form: FormProps) {
  const { sendMessage, input, setInput } = Form;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage({ text: input });
        setInput('');
      }}
      className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 mb-8 flex gap-2'
    >
      <input
        className='flex-1 dark:bg-zinc-900 p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl'
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Type your message...'
      />
      <button
        type='submit'
        className='bg-blue-500 hover:bg-blue-600 dark:bg-zinc-900 text-white px-4 py-2 rounded shadow-xl cursor-pointer'
      >
        Send
      </button>
    </form>
  );
}
