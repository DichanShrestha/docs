import CreateDoc from "./_components/create-doc";
import WsStatus from "./_components/wsStatus";

export default function Home() {
  return (
    <div>
      <WsStatus />
      <br />
      <CreateDoc />
    </div>
  );
}
