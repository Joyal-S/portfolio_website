"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/features/contact/actions";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required").max(5000),
});

type FormData = z.infer<typeof schema>;

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("message", data.message);

    const result = await submitContactForm(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <motion.div
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <label htmlFor="name" className="text-sm font-medium text-foreground/80">
            Name
          </label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </motion.div>

        <motion.div
          custom={1}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <label htmlFor="email" className="text-sm font-medium text-foreground/80">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </motion.div>
      </div>

      <motion.div
        custom={2}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <label htmlFor="message" className="text-sm font-medium text-foreground/80">
          Message
        </label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Your message..."
          rows={5}
        />
        {errors.message && (
          <p className="text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </motion.div>

      <motion.div
        custom={3}
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        className="pt-2"
      >
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" aria-hidden="true" />
              Send Message
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
