import MainPage from "@/components/MainPage";
import Container from "@/components/Container";
import Banner from "@/components/Banner";

export default async function Homepage() {
  return (
    <div className="mt-5 p-20">
      <Container>
        <div>
          <Banner />
        </div>
        <div>
          <MainPage />
        </div>
      </Container>
    </div>
  );
}