import { SectionHeader } from '@/components/shared/SectionHeader'
import { GuidanceTable } from '@/components/shared/GuidanceTable'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { ComingSoonBadge } from '@/components/shared/ComingSoonBadge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

const SUB_NAV = [
  { label: 'Traits', anchor: 'traits' },
  { label: 'Channel Tones', anchor: 'channels' },
  { label: "Do's & Don'ts", anchor: 'dos-donts' },
  { label: "Scudamore's-isms", anchor: 'isms' },
  { label: 'AI Brand Checker', anchor: 'ai-checker' },
]

const VOICE_TRAITS = [
  {
    name: 'Warm',
    summary: 'Like an informed friend showing you their city — not a tour guide, not a brochure.',
    doExample: '"Wrap up warm — the Cam holds the cold long after the air\'s turned. There\'ll be blankets in the punt."',
    dontExample: '"Welcome to our premium punting experience where you\'ll enjoy the iconic sights of Cambridge!"',
    dontReason: 'Sounds like every other tour company.',
  },
  {
    name: 'Quietly Confident',
    summary: "We've been doing this since 1910. We don't need to shout. The heritage is bedrock; we don't keep tapping on it.",
    doExample: '"Cambridge\'s oldest punting company. Founded 1910, family-run ever since."',
    dontExample: '"We are PROUD to be Cambridge\'s #1 punting company!! Book now!!!!"',
    dontReason: 'Exclamation marks doing work the words should do.',
  },
  {
    name: 'Knowledgeable',
    summary: 'We know our river, our city, our craft. Specificity is a love language.',
    doExample: '"Stop on the Bridge of Sighs side and you\'ll see the wisteria coming through in late May."',
    dontExample: '"Enjoy stunning views of Cambridge\'s beautiful historic buildings and landmarks."',
    dontReason: 'Could appear word-for-word on any competitor\'s site.',
  },
  {
    name: 'Unfussy',
    summary: "Plainspoken, no jargon, no sales-speak. We say 'punt', not 'vessel'. 'Trip', not 'experience'.",
    doExample: '"Two hours on the Cam, a chauffeur who knows the river, and a flask of something warm if it\'s chilly. £95."',
    dontExample: '"Embark on an immersive, curated journey through Cambridge\'s most iconic waterways."',
    dontReason: 'Stacked adjectives and marketing-speak abstractions.',
  },
  {
    name: 'Playful',
    summary: "There's a twinkle. Dry, occasional, confident enough not to push.",
    doExample: '"Yes, you can fall in. No, you almost certainly won\'t."',
    dontExample: '"Lol punting is SO fun you guys!! 😂 Come punt with us!!"',
    dontReason: "That's not a twinkle — that's performing for the algorithm.",
  },
]

const CHANNEL_TONES = [
  { channel: 'Website hero', tone: 'Anchored, evocative, declarative', example: 'Where Cambridge goes punting. Founded 1910, family-run since.' },
  { channel: 'Tour product page', tone: 'Warm, knowledgeable, specific', example: 'Two hours on the Cam with a chauffeur who knows the river. Mill Lane departure, along the Backs past King\'s Chapel, the Wren Library, the Bridge of Sighs. Book late afternoon — that\'s when the colleges are catching the light.' },
  { channel: 'Booking confirmation', tone: 'Quietly confident, useful, friendly', example: 'You\'re booked. Saturday 14 June, 6pm, Mill Lane. Wrap up warm — the Cam holds the cold long after the air\'s turned. Any questions, just reply.' },
  { channel: 'Newsletter', tone: 'Warm, slow, evocative', example: 'The May Balls have started. From the river, you can see the marquee lights catching on the water before you can hear the music.' },
  { channel: 'Instagram caption', tone: 'Playful, specific, light', example: 'Punt no. 17, taken out for her first run of the season this morning. She\'s been with us since 1962 and she\'s still the prettiest in the yard.' },
  { channel: 'Customer service', tone: 'Plainspoken, generous, calm', example: 'Sorry to hear that — let\'s sort it out. Could you send over your booking reference and I\'ll find you in the system?' },
  { channel: 'B2B / partnerships', tone: 'Professional, warm, plainspoken', example: 'We work with about twenty colleges and a handful of corporate partners on private hire. Happy to send through what we typically offer for groups your size.' },
  { channel: 'Internal / team', tone: 'Playful, retro, dry', example: 'Right, fireworks rota\'s up. Three evenings, four chauffeurs, one flask of tea per boat. Speak now or forever pretend you didn\'t see this.' },
]

const AVOID_PHRASES = [
  { type: 'Competitor phrasing', items: [
    { bad: '"Let\'s go punting"', reason: 'Competitor\'s name — reword.' },
    { bad: '"Glide along the river"', reason: 'Generic — appears on every competitor\'s site.' },
    { bad: '"Cam River"', reason: 'It\'s "the Cam" or "the River Cam". Never "Cam River".' },
    { bad: '"Glorious / magnificent / majestic"', reason: 'Tourism clichés. Pick one specific detail instead.' },
  ]},
  { type: 'Marketing-speak to avoid', items: [
    { bad: '"Proud to announce / partner with / offer"', reason: 'Just say it. Pride is implicit.' },
    { bad: '"We\'d love it if you considered…"', reason: 'Apologetic over-explaining. State the offer.' },
    { bad: '"Stunning, beautiful, unforgettable"', reason: 'Stacked adjectives. Pick one or none.' },
    { bad: '"Immersive journey / curated experience"', reason: 'Use when accurate. Cut when filler.' },
  ]},
  { type: 'Patterns that read like AI', items: [
    { bad: 'Even-paragraph-shape rhythms', reason: 'Hedged copy that could appear anywhere.' },
    { bad: 'ALL CAPS for emphasis', reason: 'Caps are reserved for brand name and overlines.' },
    { bad: '"Unforgettable / iconic / bucket-list"', reason: 'Not forbidden — but only use if genuinely true and specific here.' },
  ]},
]

const ISMS = [
  { term: 'The Cam', note: 'Not "Cam River" or "River Cam" in running copy — just "the Cam".' },
  { term: 'Punt', note: 'Flat-bottomed pole-and-plank vessel. Not "boat" (too generic).' },
  { term: 'Chauffeur', note: 'Our preferred term for a guided punting driver. Pending team alignment vs "guide".' },
  { term: 'Mill Lane', note: 'Our main boatyard. Always "Mill Lane" not "the boatyard".' },
  { term: 'The Backs', note: 'The stretch of river behind the colleges. Capital B.' },
  { term: 'Bridge of Sighs', note: 'Named landmark at St John\'s College. Always capitalised.' },
  { term: 'Mathematical Bridge', note: 'Queens\' College bridge. Always full name.' },
]

export function Voice() {
  return (
    <div>
      <SectionHeader
        eyebrow="Brand Voice"
        title="Voice & Tone"
        description="The voice of someone who's been on this river for a hundred-plus years and doesn't need to make a fuss about it. Warm, quietly confident, knowledgeable, unfussy, playful."
      />

      <SectionSubNav items={SUB_NAV} />

      {/* Anchor line */}
      <div className="rounded-xl bg-navy-900 dark:bg-navy-1000 text-cream-50 p-8 mb-14">
        <p className="font-sans text-xs uppercase tracking-caps text-gold-300 mb-3">The sniff test</p>
        <p className="font-display font-bold text-3xl md:text-4xl tracking-display mb-4">
          "Where Cambridge goes punting."
        </p>
        <p className="font-sans text-base text-navy-100 max-w-xl">
          Before publishing, ask: <em>Could a competitor publish this sentence verbatim?</em> If yes, rewrite it. The voice should be unmistakably Scudamore's — specific where they're generic, calm where they're loud, knowledgeable where they're keyword-stuffed.
        </p>
      </div>

      {/* Traits */}
      <section id="traits" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Voice Traits</h2>
        <div className="space-y-6">
          {VOICE_TRAITS.map(trait => (
            <Card key={trait.name} className="gap-0 overflow-hidden">
              <div className="px-5 py-4 bg-card">
                <h3 className="mb-1 font-sans text-xl font-semibold text-foreground">{trait.name}</h3>
                <p className="font-sans text-sm text-muted-foreground">{trait.summary}</p>
              </div>
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                <div className="p-5 bg-green-50 dark:bg-green-950/30">
                  <p className="font-sans text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-caps mb-2">✓ Do</p>
                  <p className="font-sans text-sm italic text-foreground">{trait.doExample}</p>
                </div>
                <div className="p-5 bg-red-50 dark:bg-red-950/30">
                  <p className="font-sans text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-caps mb-2">✗ Don't</p>
                  <p className="font-sans text-sm italic text-foreground line-through opacity-60">{trait.dontExample}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-2">{trait.dontReason}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Channel tones */}
      <section id="channels" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Tone by Channel</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">Voice stays constant. Tone flexes by context.</p>
        <GuidanceTable label="Tone by channel" tableClassName="min-w-[44rem]">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Channel</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Tone</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CHANNEL_TONES.map(row => (
                <tr key={row.channel} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{row.channel}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.tone}</td>
                  <td className="min-w-72 px-4 py-3 text-xs italic text-muted-foreground">“{row.example}”</td>
                </tr>
              ))}
            </tbody>
        </GuidanceTable>
      </section>

      <Separator className="mb-14" />

      {/* Do's & Don'ts */}
      <section id="dos-donts" className="scroll-mt-6 mb-14">
        <h2 className="mb-6 font-sans text-2xl font-semibold text-foreground">Do's & Don'ts</h2>
        <div className="space-y-8">
          {AVOID_PHRASES.map(group => (
            <div key={group.type}>
              <h3 className="mb-3 font-sans text-base font-semibold text-foreground">{group.type}</h3>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start py-2 border-b border-border last:border-0">
                    <span className="font-sans text-sm text-red-600 dark:text-red-400 shrink-0 mt-0.5">✗</span>
                    <div>
                      <p className="font-sans text-sm font-medium text-foreground">{item.bad}</p>
                      <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mb-14" />

      {/* Scudamore's-isms */}
      <section id="isms" className="scroll-mt-6 mb-14">
        <h2 className="mb-2 font-sans text-2xl font-semibold text-foreground">Scudamore's-isms</h2>
        <p className="font-sans text-sm text-muted-foreground mb-6">House vocabulary — pending final team alignment.</p>
        <GuidanceTable label="Scudamore’s vocabulary and usage notes">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Term</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-caps text-muted-foreground">Usage note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ISMS.map(row => (
                <tr key={row.term} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{row.term}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
        </GuidanceTable>
      </section>

      <Separator className="mb-14" />

      {/* AI Brand Checker placeholder */}
      <section id="ai-checker" className="scroll-mt-6 mb-14">
        <Card className="gap-0 border-dashed text-center">
          <CardContent className="p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold-500 dark:text-gold-300" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="font-sans text-2xl font-semibold text-foreground">AI Brand Checker</h2>
              <ComingSoonBadge />
            </div>
            <p className="font-sans text-sm text-muted-foreground max-w-md mx-auto">
              Paste your copy and get AI-powered feedback on whether it sounds like Scudamore's. Powered by Claude — it'll know the difference between "glide along the river" and good writing.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
