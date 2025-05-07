

export async function POST(request: Request) {
  const { action, data } = await request.json();
  
  switch (action) {
    case 'ocr':
      return new Response(JSON.stringify({
        text: "This is a simulated OCR response that would come from a Python backend with Tesseract or another OCR library."
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    case 'voice':
      return new Response(JSON.stringify({
        response: "This is a simulated voice processing response that would come from a Python backend with NLP capabilities."
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    default:
      return new Response(JSON.stringify({
        error: "Unknown action"
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}