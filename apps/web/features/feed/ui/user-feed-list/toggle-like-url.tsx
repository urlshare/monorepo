import { api } from "@/trpc/react";
import { Feed } from "@workspace/db/types";
import { toast } from "@workspace/ui/components/sonner";
import { Heart } from "lucide-react";
import { FC, useState } from "react";

type ToggleLikeUrlProps = {
  feedId: Feed["id"];
  liked: boolean;
  likes: number;
};

const LikedIcon = () => <Heart fill="#dc2626" color="#dc2626" size={18} strokeWidth={1} />;
export const NotLikedIcon = () => <Heart size={18} strokeWidth={1} />;

export const ToggleLikeUrl: FC<ToggleLikeUrlProps> = ({ feedId, liked, likes }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [likesCount, setLikesCount] = useState(likes);

  const { mutate: toggle, isPending: isToggling } = api.feeds.toggleLikeUrl.useMutation({
    onSuccess(result) {
      if (result.status === "notFound") {
        // TODO: Remove not found feed entry by its ID, perhaps also notify via toast.
      } else {
        setLikesCount(result.likesCount);
        setIsLiked(result.status === "liked");
      }
    },
    onError() {
      const originalLikesCount = isLiked ? likesCount + 1 : likesCount - 1;

      setLikesCount(originalLikesCount);
      toast(`Could not ${isLiked ? "un" : ""}like 😞`, {
        description: "Sorry for the inconvenience. Try again.",
      });
    },
  });

  return (
    <button
      className="flex items-center gap-1.5 rounded-xl p-2 text-sm hover:bg-red-50"
      disabled={isToggling}
      onClick={() => {
        const newOptimisticUpdateLikesCount = isLiked ? likesCount - 1 : likesCount + 1;

        setLikesCount(newOptimisticUpdateLikesCount);
        toggle({ feedId });
      }}
    >
      {isLiked ? isToggling ? <NotLikedIcon /> : <LikedIcon /> : isToggling ? <LikedIcon /> : <NotLikedIcon />}
      {likesCount}
    </button>
  );
};
