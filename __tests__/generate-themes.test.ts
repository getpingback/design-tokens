import * as fs from "fs";
import path from "path";
import {
  applyReferenceValue,
  changeReferences,
  convertRGBAtoHex,
  cleanJson,
  toKebabCase,
  generateCSSTheme,
  appendThemeToMainCss,
} from "../src/utils";

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe("generate-themes", () => {
  describe("utils", () => {
    describe("toKebabCase", () => {
      it("should convert string to kebab case", () => {
        const str = "string to kebab case";
        const kebabCaseStr = "string-to-kebab-case";

        expect(toKebabCase(str)).toBe(kebabCaseStr);
      });
    });

    describe("jsonTransformation", () => {
      describe("applyReferenceValue", () => {
        it("should apply reference values to string properties of an object based on a reference object", () => {
          const json = {
            color: {
              primary: "#ffffff16",
            },
          };

          const valueToReplace = "{color.primary};";
          const expectedValue = json.color.primary;

          expect(applyReferenceValue(valueToReplace, json)).toBe(expectedValue);
        });
      });

      describe("convertRGBAtoHex", () => {
        it("should convert RGBA color strings to their equivalent hexadecimal representation", () => {
          const rgbaString = "rgba(255,255,255,0.1)";
          const expectedHexColor = "255fe01";

          expect(convertRGBAtoHex(rgbaString)).toBe(expectedHexColor);
        });
      });

      describe("changeReferences", () => {
        it("should recursively apply reference values to string properties of an object based on a reference object and convert RGBA colors to hexadecimal format", () => {
          const json = {
            color: {
              primary: "#ffffff16",
            },
            backgroundColor: "rgba(255,255,255,0.1)",
          };

          const expectedJson = {
            color: {
              primary: "#ffffff16",
            },
            backgroundColor: "255fe01",
          };

          // @ts-ignore
          expect(changeReferences(json, json)).toStrictEqual(expectedJson);
        });
      });

      describe("cleanJson", () => {
        it("should handle simple string values", () => {
          const input = {
            key1: { value: "value1" },
            key2: { value: "value2" },
          };
          const expected = { key1: "value1", key2: "value2" };
          expect(cleanJson(input)).toEqual(expected);
        });

        it("should handle nested objects containing string values", () => {
          const input = {
            key1: {
              nestedKey1: { value: "value1" },
              nestedKey2: { value: "value2" },
            },
          };
          const expected = {
            key1: { nestedKey1: "value1", nestedKey2: "value2" },
          };
          expect(cleanJson(input)).toEqual(expected);
        });

        it("should handle arrays of objects, removing type and color", () => {
          const input = {
            key1: {
              nestedKey1: {
                value: [
                  { type: "type1", color: "red", size: 10 },
                  { type: "type2", color: "blue", size: 20 },
                ],
              },
            },
          };
          const expected = {
            key1: {
              nestedKey1: "10px red, 20px blue",
            },
          };
          expect(cleanJson(input)).toEqual(expected);
        });

        it("should handle nested objects containing other objects as values", () => {
          const input = {
            key1: {
              nestedKey1: { value: { prop1: "value1", prop2: "value2" } },
            },
          };
          const expected = {
            key1: {
              nestedKey1: { prop1: "value1", prop2: "value2" },
            },
          };
          expect(cleanJson(input)).toEqual(expected);
        });
      });
    });

    describe("cssTransformation", () => {
      describe("generateCSSTheme", () => {
        it("generates correct CSS for flat objects", () => {
          const obj = { color: "red", background: "blue" };
          expect(generateCSSTheme(obj)).toEqual(
            "--color: red;\n--background: blue;\n"
          );
        });

        it("generates correct CSS for nested objects", () => {
          const obj = { button: { color: "red", background: "blue" } };
          expect(generateCSSTheme(obj)).toEqual(
            "--button-color: red;\n--button-background: blue;\n"
          );
        });

        it("wraps CSS in a class if themeName is provided", () => {
          const obj = { color: "red" };
          expect(generateCSSTheme(obj, "", "my-theme")).toEqual(
            ".my-theme {--color: red;\n}"
          );
        });
      });

      describe("appendThemeToMainCss", () => {
        beforeEach(() => {
          (fs.readFileSync as jest.Mock).mockClear();
          (fs.writeFileSync as jest.Mock).mockClear();
        });

        it("appends theme import to main.css", () => {
          const mockReadFileSync = fs.readFileSync as jest.Mock;
          const mockWriteFileSync = fs.writeFileSync as jest.Mock;

          mockReadFileSync.mockReturnValue("existing content");

          appendThemeToMainCss("color", "theme");

          const expectedFilePath = path.join(
            __dirname,
            "../../themes/main.css"
          );
          const expectedContent =
            'existing content\n\n@import url("./color/theme");';

          expect(mockWriteFileSync).toHaveBeenCalledWith(
            expect.stringContaining("themes/main.css"),
            expectedContent
          );
        });
      });
    });
  });
});
