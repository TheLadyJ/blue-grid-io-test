import { transformData } from "./index";
import { FileItem } from "./interfaces";

const testData: FileItem[] = [
  { fileUrl: "http://34.8.32.234:48183/SvnRep/ADV-H5-New/README.txt" },
  { fileUrl: "http://34.8.32.234:48183/SvnRep/ADV-H5-New/VisualSVN.lck" },
  { fileUrl: "http://34.8.32.234:48183/SvnRep/ADV-H5-New/hooks-env.tmpl" },
  { fileUrl: "http://34.8.32.234:48183/SvnRep/AT-APP/README.txt" },
  { fileUrl: "http://34.8.32.234:48183/SvnRep/AT-APP/VisualSVN.lck" },
  { fileUrl: "http://34.8.32.234:48183/SvnRep/AT-APP/hooks-env.tmpl" },
  { fileUrl: "http://34.8.32.234:48183/SvnRep/README.txt" },
  { fileUrl: "http://34.8.32.234:48183/SvnRep/VisualSVN.lck" },
  { fileUrl: "http://34.8.32.234:48183/SvnRep/hooks-env.tmpl" },
  { fileUrl: "http://34.8.32.234:48183/www/README.txt" },
  { fileUrl: "http://34.8.32.234:48183/www/VisualSVN.lck" },
  { fileUrl: "http://34.8.32.234:48183/www/hooks-env.tmpl" },
];

const expectedResult = {
  "34.8.32.234": [
    {
      SvnRep: [
        {
          "ADV-H5-New": ["README.txt", "VisualSVN.lck", "hooks-env.tmpl"],
        },
        {
          "AT-APP": ["README.txt", "VisualSVN.lck", "hooks-env.tmpl"],
        },
        "README.txt",
        "VisualSVN.lck",
        "hooks-env.tmpl",
      ],
    },
    {
      www: ["README.txt", "VisualSVN.lck", "hooks-env.tmpl"],
    },
  ],
};

describe("transformData", () => {
  it("should transform data into the expected structure", () => {
    const result = transformData(testData);
    expect(result).toEqual(expectedResult);
  });
});
