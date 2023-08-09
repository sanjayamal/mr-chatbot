import React from "react";
import { CopyBlock, atomOneLight } from "react-code-blocks";
import { Theme } from "react-code-blocks/dist/types";

interface ICodeBlockSection {
  code: string;
  language: string;
  showLineNumbers: boolean;
}

const customTheme: Theme = {
  ...atomOneLight, // Use the base theme as a starting point
  mode: "light", // Set the mode property to "light" or "dark"
  // Add any additional customizations to the theme here
};
const CodeBlockSection: React.FC<ICodeBlockSection> = ({
  code,
  language,
  showLineNumbers = false,
}) => {
  return (
    <CopyBlock
      text={code}
      language={language}
      showLineNumbers={showLineNumbers}
      theme={customTheme}
      wrapLongLines
      codeBlock
      copied
      onCopy={() => {}}
    />
  );
};

export default CodeBlockSection;
