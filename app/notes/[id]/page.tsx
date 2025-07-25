import type { Metadata } from "next"
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { fetchNoteById } from "@/lib/api"
import NoteDetailsClient from "./NoteDetails.client"

type Props = {
  params: Promise<{ id: string }>;
};

const NoteDetails = async ({ params }: Props) => {
  const { id }  = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const note = await fetchNoteById(id)
  return {
    title: `Note: ${note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://notehub.com/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://placehold.co/1200x630',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'article',
    },
  }
}

