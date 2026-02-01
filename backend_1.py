import json
from openai import OpenAI
from cv_generator import CVGenerator
import os
import sys
import re

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

class CVProcessor:
    def __init__(self, input_file, output_file, api_key, system_prompt_file):
        self.input_file = input_file
        self.output_file = output_file
        self.client = OpenAI(api_key=api_key)
        with open(system_prompt_file, "r") as f:
            self.system_prompt = f.read()

    def load_and_clean(self):
        with open(self.input_file, "r") as file:
            data = json.load(file)

        clean_data = {
            key: value
            for key, value in data.items()
            if value is not None and not (isinstance(value, str) and value.strip().lower() == "none")
        }
        return clean_data

    def convert_to_structured_cv(self, clean_data):
        response = self.client.chat.completions.create(
            model="gpt-5-nano",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": f"RAW CV DATA:\n{clean_data}"}
            ]
        )
        content = response.choices[0].message.content

        # parsing logic
        match = re.search(r"```(?:json)?(.*?)```", content, re.DOTALL)
        if match:
            content = match.group(1).strip()
            
        return content.strip()

    def save_structured_cv(self, structured_cv):
        try:
            structured_cv_json = json.loads(structured_cv)  # Try to parse as JSON
        except json.JSONDecodeError:
            structured_cv_json = {"structured_cv": structured_cv}

        with open(self.output_file, "w") as f:
            f.write(json.dumps(structured_cv_json, indent=2))
            f.write("\n")  # ensure each entry is on a new line

        print(f"Structured CV saved successfully in {self.output_file}!")

    # ---------- NEW: Secure JSON wipe function ----------
    def wipe_json_file(self, file_path):
        """Overwrite a JSON file with an empty object {} without deleting the file."""
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump({}, f, indent=2)
        print(f"Securely wiped contents of: {file_path}")

    def run(self):
        clean_data = self.load_and_clean()
        structured_cv = self.convert_to_structured_cv(clean_data)
        self.save_structured_cv(structured_cv)


if __name__ == "__main__":
    api_key = os.environ.get("OPENAI_API_KEY")
    processor = CVProcessor(
        input_file="Temporary_File_1.json",
        output_file="Temporary_File_2.json",
        api_key=api_key,
        system_prompt_file="system_prompt.txt"
    )
    processor.run()

    print("\nGenerating DOCX CV from structured JSON...")
    generator = CVGenerator()
    cv_path = generator.generate_cv("Temporary_File_2.json")
    print(f"CV generated successfully at: {cv_path}")

    # ---------- NEW: secure deletion after creating CV ----------
    print("\nWiping JSON files for user data protection...")

    processor.wipe_json_file("Temporary_File_1.json")
    processor.wipe_json_file("Temporary_File_2.json")

    print("All temporary data has been securely wiped.")

