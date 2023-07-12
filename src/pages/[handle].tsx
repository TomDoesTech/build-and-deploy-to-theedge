import { useRouter } from "next/router";
import { FormEvent } from "react";
import { useMutation, useQuery } from "react-query";

type Comment = {
  id: string;
  comment: string;
  created_at: string;
};

export default function HandlePage() {
  const router = useRouter();
  const handle = router.query.handle as string;

  const { data, refetch } = useQuery({
    queryFn: () =>
      fetch(`/api/comments?page=${handle}`).then((res) =>
        res.json()
      ) as Promise<Array<Comment>>,
    queryKey: [`handle_${handle}`],
    enabled: Boolean(handle),
  });

  const mutation = useMutation({
    mutationFn: (comment: string) => {
      return fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          comment,
          page: handle,
        }),
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);

    const comment = (data.get("comment") as string).trim();

    if (!comment) return;

    mutation.mutate(comment);
  }

  return (
    <main className="text-center p-4">
      <h1 className="mb-4 text-4xl font-extrabold dark:text-white">
        Ask anonymously
      </h1>

      {mutation.isLoading && <p>Your comment is being created...</p>}

      {!mutation.isLoading && !mutation.isSuccess && (
        <div className="w-full flex justify-center">
          <form className="w-full max-w-xs" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="handle"
              >
                Comment
              </label>
              <input
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                id="comment"
                name="comment"
                type="text"
                placeholder="How old are you?!?"
                required
              />
            </div>

            <div>
              <button
                className="bg-blue-500 rounded shadow text-white py-2 px-4"
                type="submit"
              >
                Ask anonymously
              </button>
            </div>
          </form>
        </div>
      )}

      {data?.map((comment) => {
        return (
          <div
            className="bg-gray-100 rounded-lg shadow-lg max-w-md mx-auto my-4"
            key={`comment__${comment.id}`}
          >
            {comment.comment}

            <br />

            <span className="text-gray-500 text-right text-sm">
              {new Date(comment.created_at).toDateString()}
            </span>
          </div>
        );
      })}
    </main>
  );
}
