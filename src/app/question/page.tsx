import type { Metadata } from "next";

import { SetMetaTitle } from "@/utils/MetaUtils";

import QuestionPlaying from "@/components/Question/QuestionPlaying";

export const metadata: Metadata = {
  title: SetMetaTitle("Question Playing"),
};

const page = () => {
  return <QuestionPlaying />;
};

export default page;
