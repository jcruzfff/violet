import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    console.log('🎤 [Whisper API] Received transcription request')
    
    // Get the form data from the request
    const formData = await request.formData()
    const audioFile = formData.get('file') as File
    const model = formData.get('model') as string || 'whisper-1'
    const language = formData.get('language') as string || 'en'
    
    if (!audioFile) {
      console.error('🎤 [Whisper API] No audio file provided')
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }
    
    console.log('🎤 [Whisper API] Audio file details:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    })
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY && !process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.error('🎤 [Whisper API] OpenAI API key not configured')
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }
    
    // Create the transcription request
    console.log('🎤 [Whisper API] Sending to OpenAI Whisper...')
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: model,
      language: language,
      response_format: 'json'
    })
    
    console.log('🎤 [Whisper API] Transcription successful:', {
      text: transcription.text?.substring(0, 100) + (transcription.text?.length > 100 ? '...' : ''),
      fullLength: transcription.text?.length
    })
    
    return NextResponse.json({
      text: transcription.text,
      success: true
    })
    
  } catch (error) {
    console.error('🎤 [Whisper API] Transcription error:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid file format')) {
        return NextResponse.json(
          { error: 'Invalid audio file format' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded' },
          { status: 429 }
        )
      }
      
      if (error.message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'OpenAI API key invalid' },
          { status: 401 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Transcription failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 