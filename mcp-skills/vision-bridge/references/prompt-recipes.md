# Prompt recipes for `analyze_image`

Pass these (adapted to the user's goal) as the `prompt` argument. Use `ocr_image` instead when you only need verbatim text.

General rule: state the goal, name the output shape, and ask for transcription of any text that matters. Asking for "exact" text and "do not paraphrase" noticeably reduces rewording.

## Error screenshots and terminals
> Transcribe the full error message and any stack trace exactly, preserving line breaks and indentation. Then state: which application or tool this is, what the user was doing when it appeared, and any file names, line numbers, or error codes visible.

## UI mockups and design screenshots
> Describe this UI top to bottom. For each element give: type (button, input, card, nav...), visible text, position in the layout (row/column, alignment), and visible state (hover, disabled, selected). Estimate the color palette as hex values and note the apparent font weight and relative sizes. Mention spacing patterns (tight, roomy, consistent grid). Do not invent elements that are not visible.

Follow up with the user for exact design tokens. Estimated hex values and sizes are approximations.

## Diagrams, flowcharts, architecture drawings
> List every node with its label. Then list every connection as "A -> B (edge label, if any)". Note groupings or swimlanes, arrow directions, and any decision points with their branch labels. Finish with a one-paragraph summary of what the diagram shows.

## Charts and graphs
> Identify the chart type, title, axis labels, units, and legend. Extract the underlying data as a markdown table. If values are read off the chart rather than labeled, mark them as approximate. Note the main trend in one sentence.

## Tables and spreadsheets
> Reproduce this table as a markdown table, keeping column headers and row order. If any cell is unreadable, write [unreadable] rather than guessing.

## Code in screenshots
Prefer `ocr_image` for pure code. If you use `analyze_image`:
> Transcribe all code exactly as a fenced code block with the correct language tag, preserving indentation. Note the file name or tab title if visible, and any highlighted lines, squiggles, or error markers.

After transcribing, run or lint the code. OCR errors in code are common (swapped brackets, missing underscores).

## Whiteboards and handwriting
> Transcribe all handwritten text. Group it by region of the board as laid out spatially, and describe any arrows or boxes that connect items. Mark anything illegible as [illegible] rather than guessing.

Expect lower accuracy than with printed text. Confirm key items with the user.

## Comparing two images
The tool takes one image per call. Describe each with the same prompt (for example, a UI before and after), then compare the two text results yourself. Use identical prompts so the descriptions are comparable.
