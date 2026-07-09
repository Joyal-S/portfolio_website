"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAchievement, updateAchievement } from "@/features/admin/actions";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["hackathon", "award"]),
  link: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  link: string | null;
}

export function AchievementForm({
  achievement,
  isNew,
}: {
  achievement: Achievement | null;
  isNew: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: achievement?.title ?? "",
      description: achievement?.description ?? "",
      date: achievement?.date ? achievement.date.substring(0, 10) : "",
      type: (achievement?.type as "hackathon" | "award") ?? "award",
      link: achievement?.link ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        date: data.date,
        type: data.type,
        link: data.link || null,
      };

      if (isNew) {
        await createAchievement(payload);
        toast.success("Achievement created");
      } else if (achievement) {
        await updateAchievement(achievement.id, payload);
        toast.success("Achievement updated");
      }

      router.push("/admin/achievements");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-xl p-6 space-y-6 max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            {...register("title")}
            placeholder="1st Place at XYZ Hackathon"
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            {...register("description")}
            placeholder="What was this achievement about?"
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input type="date" {...register("date")} />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select
            {...register("type")}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="award">Award</option>
            <option value="hackathon">Hackathon</option>
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Link</label>
          <Input
            {...register("link")}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isNew ? "Create Achievement" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/achievements")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
