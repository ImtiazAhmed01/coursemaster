export default function VideoPlayer({ url }) {
    return (
        <iframe
            width="100%"
            height="400"
            className="rounded-xl"
            src={url}
            title="Course Video"
            allowFullScreen
        ></iframe>
    );
}
