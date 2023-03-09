import type { NextPage } from "next";
import useSWR from "swr";
import useCurrentLocation from "@libs/useCurrentLocation";
import Layout from "../components/layout";
import { weatherType } from "./api/weather";
import Content from "@components/content";
import Spinner from "@components/spinner";
interface SWRProps {
  ok: boolean;
  body: [weatherType];
}
interface WeatherDetailProps {
  [key: string]: string;
}

const Home: NextPage = () => {
  const { latitude, longitude } = useCurrentLocation();

  const { data } = useSWR<SWRProps>(
    latitude && longitude ? `/api/weather?latitude=${latitude}&longitude=${longitude}` : null
  );
  const { data: addrData } = useSWR(
    latitude && longitude ? `/api/addr?latitude=${latitude}&longitude=${longitude}` : null
  );

  const weatherData = {
    ...data?.body.reduce((acc: WeatherDetailProps, curr) => {
      acc[curr.category] = curr.fcstValue;
      return acc;
    }, {}),
    addr: addrData?.addr,
    forecastTime: data?.body[0].fcstTime as string,
  };
  return (
    <Layout>
      <main className="mx-auto max-w-xl px-8 sm:px-0">
        {!data ? (
          <div className="py-20">
            <Spinner />
          </div>
        ) : (
          <Content {...weatherData} />
        )}
      </main>
    </Layout>
  );
};

export default Home;
