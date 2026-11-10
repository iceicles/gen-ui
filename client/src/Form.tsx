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
      className='w-full max-w-md self-center shrink-0 px-4 mt-4 mb-8 flex gap-2'
    >
      <input
        className='min-w-0 flex-1 dark:bg-zinc-900 p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl'
        type='text'
        aria-label='Message'
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
