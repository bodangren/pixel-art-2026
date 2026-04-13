import { NextRequest, NextResponse } from 'next/server'
import { saveReview } from '@/../lib/data'
import { reviewSchema } from '@/../lib/schemas'

export async function POST(request: NextRequest) {
  // Only allow saving in review mode (local development)
  if (process.env.NEXT_PUBLIC_REVIEW_MODE !== 'true') {
    return NextResponse.json({ error: 'Review mode not enabled' }, { status: 403 })
  }

  try {
    const { runId, reviewData } = await request.json()
    
    if (!runId || !reviewData) {
      return NextResponse.json({ error: 'Missing runId or reviewData' }, { status: 400 })
    }

    // Validate review data
    const validatedReview = reviewSchema.parse(reviewData)
    
    await saveReview(runId, validatedReview)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error saving review:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
