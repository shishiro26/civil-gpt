import { motion } from "framer-motion";
import { MessageIcon } from "../icons";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-[500px] mt-20 mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="border-none bg-muted/50 rounded-2xl p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <MessageIcon />
          <span className="text-lg font-semibold">BVRIT Civil Chatbot</span>
        </p>
        <p>
          Welcome to the official BVRIT Civil Engineering chatbot. This
          assistant is designed to help students quickly find information
          related to academics, faculty, timetable, and department resources.
        </p>
        <p>
          Whether you’re looking for syllabus details, lab manuals, important
          announcements, or contact information, this chatbot is here to make
          your department experience smoother and more accessible.
        </p>
        <p>
          If you have specific questions, just ask — the chatbot is always ready
          to assist!
        </p>
      </div>
    </motion.div>
  );
};
