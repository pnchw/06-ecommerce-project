import MainPage from "@/components/MainPage";
import Container from "@/components/Container";
import Banner from "@/components/Banner";

export default function Homepage() {
  return (
    <div className="mt-15 px-2 sm:px-4 md:px-8 lg:px-20 py-4 sm:py-6 lg:py-10">
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