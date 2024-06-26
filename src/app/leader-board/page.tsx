import type { Metadata } from "next";

import { SetMetaTitle } from "@/utils/MetaUtils";

import QuestionLeaderBoard from "@/components/Question/QuestionLeaderBoard";

export const metadata: Metadata = {
  title: SetMetaTitle("Leader Board"),
};

const page = () => {
  return <QuestionLeaderBoard />;
};

export default page;
