import type { Metadata } from "next";

import { SetMetaTitle } from "@/utils/MetaUtils";

import QuestionStartPlayer from "@/components/Question/QuestionStartPlayer";

export const metadata: Metadata = {
  title: SetMetaTitle("Enter Your Name"),
};

const page = () => {
  return <QuestionStartPlayer />;
};

export default page;
