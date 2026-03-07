import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getFeedbacks,
  createFeedback,
  FeedbackDTO,
} from "@/services/feedbackService";

// ✅ Props com dados reais do usuário
interface FeedbackTabProps {
  userId: string;
  authorName: string;
  courseName: string;
}

function StarRating({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (v: number) => void;
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={interactive ? 28 : 18}
          className={`transition-colors ${
            star <= (interactive ? hovered || rating : rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer" : ""}`}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: FeedbackDTO }) {
  const initials = feedback.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3">
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-full flex flex-col gap-3">
        <StarRating rating={feedback.rating} />
        <p className="text-gray-600 italic text-sm flex-1">
          "{feedback.comment}"
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center text-sm">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {feedback.authorName}
            </p>
            <p className="text-xs text-gray-400">{feedback.courseName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Recebe props do usuário logado
export default function FeedbackTab({
  userId,
  authorName,
  courseName,
}: FeedbackTabProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: getFeedbacks,
  });

  const mutation = useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      setRating(0);
      setComment("");
    },
  });

  const handleSubmit = () => {
    if (rating === 0 || !comment.trim()) return;
    mutation.mutate({
      userId, // ✅ real
      authorName, // ✅ real
      courseName, // ✅ real
      rating,
      comment,
    });
  };

  return (
    <div className="space-y-8 py-4">
      {/* Formulário */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Avaliar o Hub do Saber
        </h3>
        <div>
          <p className="text-sm text-gray-500 mb-2">Sua nota:</p>
          <StarRating rating={rating} onRate={setRating} interactive />
        </div>
        <Textarea
          placeholder="Conte sua experiência..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || !comment.trim() || mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {mutation.isPending ? "Enviando..." : "Enviar Avaliação"}
        </Button>
        {mutation.isSuccess && (
          <p className="text-green-600 text-sm font-medium">
            ✓ Obrigado pelo seu feedback!
          </p>
        )}
      </div>

      {/* Carrossel */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            O que dizem nossos usuários
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              ‹
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              ›
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-sm">Carregando feedbacks...</p>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {feedbacks.map((fb) => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
