import pypdf


def get_character_count_in_pdf(file):
    total_characters = 0

    pdf_reader = pypdf.PdfReader(file)

    for page_number in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_number]
        text = page.extract_text()
        total_characters += len(text)
    return total_characters
