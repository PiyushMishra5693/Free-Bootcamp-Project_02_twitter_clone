import Post from "./Post";
import PostSkeleton from "../skelton/PostSkeltan";
import { useQuery } from "@tanstack/react-query";

const Posts = ({ feedType,username ,userId}) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`
			case "likes":
				return `/api/posts/liked/${userId}`
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data: posts,
		isLoading,
		isError,
		error,
		isFetching,
	} = useQuery({
		queryKey: ["posts", feedType],
		queryFn: async () => {
			const res = await fetch(POST_ENDPOINT);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(
					data.error || data.message || "Something went wrong"
				);
			}

			return data;
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center">
				<PostSkeleton />
				<PostSkeleton />
				<PostSkeleton />
			</div>
		);
	}

	if (isError) {
		return (
			<p className="text-center my-4 text-red-500">
				{error.message}
			</p>
		);
	}

	if (!Array.isArray(posts) || posts.length === 0) {
		return (
			<p className="text-center my-4">
				No posts in this tab. Switch 👻
			</p>
		);
	}

	return (
		<div>
			{isFetching && (
				<p className="text-center text-sm text-gray-500">
					Refreshing posts...
				</p>
			)}

			{posts.map((post) => (
				<Post key={post._id} post={post} />
			))}
		</div>
	);
};

export default Posts;