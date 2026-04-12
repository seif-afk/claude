from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

style = doc.styles['Normal']
font = style.font
font.name = 'Arial'
font.size = Pt(11)

title = doc.add_heading('', level=1)
run = title.add_run('ZoomInfo vs Outbound Agency:\nWhich Is Better For Your Branded Merch Company?')
run.font.size = Pt(22)
run.font.color.rgb = RGBColor(0, 0, 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

subtitle = doc.add_paragraph()
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = subtitle.add_run('YouTube Video Script  |  Netswick')
run.font.size = Pt(12)
run.font.color.rgb = RGBColor(128, 128, 128)

doc.add_paragraph('')

def add_section_header(text):
    h = doc.add_heading('', level=2)
    run = h.add_run(text)
    run.font.size = Pt(16)
    run.font.color.rgb = RGBColor(0, 0, 0)

def add_timestamp(text):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(150, 150, 150)
    run.font.italic = True

def add_body(text):
    p = doc.add_paragraph(text)
    p.paragraph_format.space_after = Pt(8)
    return p

def add_talking_point(text):
    p = doc.add_paragraph()
    run = p.add_run('>> ')
    run.font.bold = True
    run.font.color.rgb = RGBColor(100, 100, 100)
    run2 = p.add_run(text)
    p.paragraph_format.space_after = Pt(6)
    return p

# ============ HOOK ============
add_section_header('HOOK')
add_timestamp('[0:00 - 0:25]')

add_body("My agency has booked almost 500 sales meetings for branded merch companies in the past three months. Including getting leads from HubSpot, Hilton, Uber, Stripe, and Charter Communications, which is a $50 billion enterprise.")

add_body("I've also had clients come to me after spending $15,000 to $30,000 a year on ZoomInfo and getting almost nothing from it.")

add_body("So today I'm going to break down both options honestly. What each one is, the pros and cons, and which one makes sense depending on your company size.")

add_body("Let's get into it.")

# ============ WHAT ZOOMINFO IS ============
add_section_header('What ZoomInfo Is')
add_timestamp('[0:25 - 2:00]')

add_talking_point("ZoomInfo is a B2B contact database. You pay for access to millions of contacts, filter by industry, company size, job title, location, and export a list.")
add_talking_point("That's the product. Names, emails, phone numbers. You take that list and do the outreach yourself.")
add_talking_point("Pricing is around $15K-$30K a year depending on plan and seats. For a lot of branded merch companies that's a serious line item.")
add_talking_point("It doesn't send the emails. Doesn't write the messaging. Doesn't call the leads. Doesn't book the meeting. You get data and the rest is on you.")

# ============ WHAT AN OUTBOUND AGENCY IS ============
add_section_header('What An Outbound Agency Does')
add_timestamp('[2:00 - 5:00]')

add_body("The simplest way to understand it is to walk through it start to finish:")

add_talking_point("They do the research to figure out who you should be targeting and what kind of offer to reach out with. Looking at your past clients, your best customers, your industry, and building a strategy around that.")
add_talking_point("They build the prospect lists for you using B2B databases and other tools to find the right companies and decision makers.")
add_talking_point("They figure out which of those prospects are more likely to need promo right now versus eventually, so the outreach is going to the right people at the right time.")
add_talking_point("They set up the entire infrastructure for doing outreach at scale. This is the part most people underestimate.")

add_body("For email: that means setting up dozens of secondary domains, hundreds of inboxes, warming everything up with AI so the emails actually land in the inbox. Using dedicated sending tools, not your CRM.")
add_body("For LinkedIn: setting up multiple accounts, connecting automation tools that send personalized connection requests and messages at volume.")
add_body("For cold calling: getting a power dialer set up with AI voicemail detection, area code matching so your number looks local, and auto-skipping dead lines.")

add_talking_point("They write all the outreach messaging for you and manage the campaigns day to day.")
add_talking_point("When someone responds with interest, the agency handles the back and forth, qualifies them, and books the meeting directly on your salesperson's calendar.")
add_talking_point("Before the meeting, they send the prospect relevant materials so by the time your salesperson gets on the call, the prospect already has context and is ready for a real conversation.")
add_talking_point("Your salesperson just shows up and closes. That's the whole thing from research to booked meeting.")

# ============ PROS AND CONS OF ZOOMINFO ============
add_section_header('Pros and Cons of ZoomInfo')
add_timestamp('[5:00 - 7:30]')

add_body("Pros:")
add_talking_point("You own the data. Export the contacts, they're yours forever, use them across any tool.")
add_talking_point("Full control over messaging and brand. Nobody is emailing prospects with your company name unless you're the one writing it.")
add_talking_point("Can be cheaper than an agency IF you already have a sales team that knows how to prospect and set up infrastructure. Big if.")
add_talking_point("Secondary uses beyond outreach: enriching CRM data, researching companies before meetings, keeping contact info fresh.")

add_body("Cons:")
add_talking_point("Data quality is not great. People change jobs, emails go dead, numbers disconnect. One prospect told me he found contacts on ZoomInfo who had retired, sold their business, or passed away. Extreme example but the general problem is real. A lot of the data is stale.")
add_talking_point("It gives you contacts but zero system. You still need to figure out infrastructure, messaging, deliverability, follow-ups, calling, booking. If your team doesn't know how to run cold outreach, the data sits in a spreadsheet and nothing happens.")
add_talking_point("Example: a promo company sent 5,000 emails from ZoomInfo contacts and booked 3 meetings. The data wasn't the problem. Generic messaging, no buying signals, sent from their main domain through HubSpot, most of it landed in spam.")
add_talking_point("It's overpriced for what it is. Newer databases like Prospeo, Apollo, Ocean.io offer comparable or better data at a fraction of the cost. So even if you want a database, ZoomInfo might not be the best value.")

# ============ PROS AND CONS OF OUTBOUND AGENCY ============
add_section_header('Pros and Cons of an Outbound Agency')
add_timestamp('[7:30 - 11:00]')

add_body("Pros:")
add_talking_point("TIME: They save you massive amounts of time. Your team doesn't have to learn how to set up email infrastructure, configure domains, write cold outreach copy, manage campaigns daily. Someone who's done this thousands of times is going to set it up faster and better than someone learning from scratch.")
add_talking_point("MONEY: They save you the wasted money you'd spend testing and failing on your own. Every bad campaign you run yourself costs you in burned domains, lost sender reputation, and months of no results. An agency that specializes in your space skips the testing phase because they already know what works.")
add_talking_point("SKILL GAP: The knowledge required to run modern outbound changes every few months. AI tools, deliverability rules, new platforms. Your reps and marketing team aren't going to keep up with this. It's a full-time specialty.")
add_talking_point("SCALE: The biggest one. Because your team is not spending time building and managing the outreach system, they now have time to handle MORE leads. You're not just getting leads with less work. You're freeing up your salespeople to actually sell. So you get more meetings AND your team has more bandwidth to close them. That compounds. That's how companies scale fast.")
add_talking_point("A specialized agency knows what works in promo specifically. No three-month testing phase. They plug you into a proven system and you see results from week one.")

add_body("Cons:")
add_talking_point("You give up some control. Someone else is reaching prospects with your company name. If the messaging is off or the tone doesn't match your brand, it reflects on you. A good agency lets you approve everything, but it still requires trust.")
add_talking_point("Higher monthly cost than a database subscription. You're paying for a team, not just data access. For smaller companies that fee can be hard to justify early on.")
add_talking_point("Results in terms of closed deals aren't instant. You'll see meetings booked quickly, often in the first week or two. But the promo sales cycle is long. Someone might love your stuff on the call and not place their first order for three to six months. ROI takes time to show on the P&L even when the system is working.")
add_talking_point("Most agencies are bad. If they don't specialize in promo, they'll waste months. If they lock you into long contracts before proving anything, red flag. More on how to pick a good one in a second.")
add_talking_point("Conflict of interest. If they work with other promo companies, you need to make sure they're not reaching the same prospects for your competitors.")

# ============ WHO EACH IS BEST FOR ============
add_section_header('Who Each One Is Best For')
add_timestamp('[11:00 - 14:00]')

add_body("Under $2M in revenue:")
add_talking_point("A database is probably the right move at this size. Not ZoomInfo though. Apollo or Prospeo for a tenth of the price. Learn Smartlead. Set up your own domains. Write your own copy. You'll make mistakes, takes a few months, but the budget might not be there for an agency yet.")

add_body("$2M to $100M in revenue:")
add_talking_point("This is where an outbound agency wins clearly.")
add_talking_point("Your sales reps have become account managers. They service existing clients, handle reorders, chase renewals. They're not prospecting and they won't start.")
add_talking_point("Your marketing team is stretched across website, trade shows, social media, catalogs. They can't absorb running a daily outreach operation on top of everything else.")
add_talking_point("The other option is hiring a go-to-market engineer internally. Someone who knows all the AI tools, the infrastructure, the messaging, the deliverability. That person is going to cost you above $10K a month in salary alone. Which is the same or more than an agency. Except the agency comes with the tools, the systems, the proven playbook, and a team. The internal hire comes with a learning curve and no guarantee they know your industry.")
add_talking_point("At this revenue level the math works. If an agency books you 15-20 qualified meetings a month and you close even a couple into accounts spending $50K-$100K a year, the return pays for the service many times over.")

add_body("Above $100M in revenue:")
add_talking_point("At this size you probably have internal marketing teams, SDR teams, demand gen people. Hiring a GTM engineer or building an internal outbound function makes more sense here because you have the budget and infrastructure to support it.")
add_talking_point("You might still use an agency for specific campaigns or new markets. But you have options that a $10M company doesn't.")

# ============ HOW TO PICK AN AGENCY ============
add_section_header('How To Pick The Right Agency')
add_timestamp('[14:00 - 15:30]')

add_talking_point("They specialize in promo. Not dentists and SaaS on the side. Full promo specialization. If they don't know the industry, they're going to waste months testing angles that someone specialized already knows don't work.")
add_talking_point("Short commitment. You should be able to see results within the first month. If they want 6-12 months upfront before proving anything, walk away.")
add_talking_point("They guarantee a specific number of meetings, not just leads. Leads are vanity. Meetings are what fills your pipeline. They should be able to tell you exactly how many qualified meetings to expect.")
add_talking_point("The ROI should map out to at least 10x on your investment with them. If they can't walk you through this math on a call and show you exactly how the numbers work based on your average deal size, that's a red flag.")
add_talking_point("They have real case studies. Not 'we sent 50,000 emails.' Actual qualified meetings booked and deals closed for companies similar to yours.")
add_talking_point("They should be a smaller, leaner team. Not a massive company that signs you up and hands you off to some random account manager. You want people who are heavily focused on your account and deeply specialized in what they do.")
add_talking_point("They handle the full funnel. Research, infrastructure, messaging, replies, calling, booking, nurturing. If they just hand you interested leads and say good luck, that's ZoomInfo with a markup.")

# ============ OUTRO ============
add_section_header('OUTRO')
add_timestamp('[15:30 - 16:00]')

add_body("So that's the honest breakdown. ZoomInfo gives you contacts. An outbound agency gives you meetings. Both have their place depending on where you are as a company.")

add_body("The outbound agency that ticks all of those boxes is Netswick. It's my company. We specialize fully in branded merch outbound, we work with leaders like Swag.com and Imprint Engine, and we've booked almost 500 meetings for promo companies in just the last three months.")

add_body("If you want a custom outbound strategy built for your branded merch company, you can book a call with me below.")

add_body("Subscribe for more breakdowns like this. Peace.")

doc.save('/home/user/claude/scripts/zoominfo-vs-outbound-agency-script.docx')
print("Done")
