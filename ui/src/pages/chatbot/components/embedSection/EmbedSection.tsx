import { CTypography, CodeBlockSection } from "../../../../components";

const EmbedSection = () => {
  return (
    <div>
      <CTypography.Paragraph>
        {"lerom hdajhdahidjajcjxajocjaojdjaodojadojao"}
      </CTypography.Paragraph>
      <CodeBlockSection
        code={`const array1 = [1, 4, 9, 16];
// Pass a function to map
const map1 = array1.map(x => x * 2);

console.log(map1);
// Expected output: Array [2, 8, 18, 32]`}
        language="javascript"
        showLineNumbers={false}
      />

      <CTypography.Paragraph>
        {"lerom hdajhdahidjajcjxajocjaojdjaodojadojao"}
      </CTypography.Paragraph>
      <CodeBlockSection
        code={`const array1 = [1, 4, 9, 16];
// Pass a function to map
const map1 = array1.map(x => x * 2);

console.log(map1);
// Expected output: Array [2, 8, 18, 32]`}
        language="javascript"
        showLineNumbers={false}
      />
    </div>
  );
};

export default EmbedSection;
