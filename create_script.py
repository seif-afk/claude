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

# ============ HOOK ============
add_section_header('HOOK')
add_timestamp('[0:00 - 0:25]')

add_body("My agency has booked almost 500 sales meetings for branded merch companies in the past three months using cold outbound. I've also had clients come to me after spending $15,000 to $30,000 a year on ZoomInfo and getting almost nothing from it.")

add_body("So today I want to break down both options honestly. What ZoomInfo actually is, what an outbound agency actually does, the pros and cons of each, and then which one makes sense depending on your company size.")

add_body("Let's get into it.")

# ============ WHAT ZOOMINFO IS ============
add_section_header('What ZoomInfo Is')
add_timestamp('[0:25 - 2:30]')

add_body("ZoomInfo is a B2B contact database. You pay for access to millions of contacts, filter by industry, company size, job title, location, and export a list of people to reach out to.")

add_body("That's the product. Names, emails, phone numbers. You take that list and do the outreach yourself, whether that's cold calling, emailing from your CRM, or handing it to your sales team.")

add_body("The pricing sits around $15,000 to $30,000 a year depending on your plan and how many seats you need. For a lot of branded merch companies, that's a serious line item.")

# ============ WHAT AN OUTBOUND AGENCY IS ============
add_section_header('What An Outbound Agency Is')
add_timestamp('[2:30 - 4:30]')

add_body("An outbound agency is a team you hire to handle your entire cold outreach operation. They build the prospect lists, set up the email infrastructure, write the messaging, send the emails, handle the replies, call the interested leads, and book meetings directly on your calendar.")

add_body("A good one will also do the upfront research. Analyzing your past clients to figure out which industries and company sizes are most likely to buy from you, finding buying signals like upcoming trade shows or hiring rounds that indicate someone needs promo right now, and building the list around that data instead of just pulling random contacts.")

add_body("They'll also set up secondary domains and inboxes so your main domain never gets burned, warm everything up before launching, and use dedicated cold email tools instead of sending from HubSpot or Outlook.")

add_body("The cost varies. Most agencies in this space charge anywhere from $3,000 to $10,000 a month, usually with a minimum commitment of one to three months.")

# ============ PROS AND CONS OF ZOOMINFO ============
add_section_header('Pros and Cons of ZoomInfo')
add_timestamp('[4:30 - 7:30]')

add_body("Starting with the pros.")

add_body("You own the data. Once you export those contacts, they're yours. You can use them however you want, whenever you want, across any tool or platform.")

add_body("You have full control over what gets sent and when. Nobody is emailing prospects on your behalf using messaging you haven't approved. If brand control matters to you, and in promo it usually does, that's a real benefit.")

add_body("It can be cheaper upfront than an agency if you already have a sales team that knows how to prospect. If your reps are disciplined and actually use the tool daily, you can get value from it.")

add_body("And you can use it for more than just cold outreach. Enriching existing contacts, researching companies before meetings, keeping your CRM data fresh. There are secondary uses.")

add_body("Now the cons.")

add_body("The data quality isn't great. I've heard this from dozens of promo companies at this point. People change jobs, emails go dead, phone numbers disconnect. One prospect told me he went through a ZoomInfo list and found contacts who had retired, sold their business, or in one case literally passed away. That's an extreme example but the general problem is real. A lot of the data is stale.")

add_body("It gives you contacts but no system. You still need to figure out the email infrastructure, the messaging, the follow-up cadence, the deliverability, the calling, the booking. ZoomInfo handles none of that. If your team doesn't know how to run cold outreach properly, the data sits in a spreadsheet and nothing happens.")

add_body("I talked to a promo company that sent 5,000 emails from ZoomInfo contacts and booked three meetings. The issue wasn't the number of contacts. It was everything that came after. Generic messaging. No buying signals. Sent from their main domain through HubSpot. Most of it probably landed in spam.")

add_body("And it's expensive for what it is. There are newer B2B databases like Prospeo, Apollo, and Ocean.io that offer comparable or better data at a fraction of the cost. So even if you want a database, ZoomInfo might not be the best value anymore.")

# ============ PROS AND CONS OF OUTBOUND AGENCY ============
add_section_header('Pros and Cons of an Outbound Agency')
add_timestamp('[7:30 - 11:00]')

add_body("Pros first.")

add_body("It's fully done for you. You don't build lists, set up domains, write copy, manage campaigns, or chase replies. Your team just takes meetings with people who already expressed interest and have a real need. For a company where the sales reps are already stretched thin managing existing accounts, this is the biggest benefit.")

add_body("A specialized agency already knows what works. If they focus on promo, they've already tested the messaging angles, they know which industries respond, they know what products to offer, they know what buying signals to look for. There's no three-month testing phase. They plug you into a system that's already producing results for similar companies.")

add_body("They handle the technical side that most promo companies don't have the skills for. Setting up 50 domains with proper DNS records, warming up a hundred inboxes, managing deliverability, using AI to find buying signals across thousands of companies. This is a full-time job that requires very specific knowledge. Your marketing person or office manager shouldn't be expected to figure this out.")

add_body("And the leads tend to be higher quality than what you'd generate doing it yourself with a raw database. Because the agency is filtering by buying signals, writing targeted messaging, and pre-qualifying responses before they ever hit your calendar.")

add_body("Now the cons. And I want to be honest about these because they're real.")

add_body("You're giving up some control. Someone else is emailing prospects with your company name. If the messaging is off, if the tone doesn't match your brand, if they reach out to a company you already work with, that reflects on you. A good agency will let you approve everything and will maintain a do-not-contact list. But it's still a level of trust you have to be comfortable with.")

add_body("It costs more per month than a database subscription. You're paying for a team of people, not just access to data. For smaller companies, that monthly fee can be hard to justify, especially in the first couple months before the leads start converting into revenue.")

add_body("Results aren't instant in terms of closed deals. You'll likely see meetings booked within the first couple weeks. But the sales cycle in promo is long. Someone might hop on a call, love your stuff, and not place their first order for three to six months. So the ROI takes time to show up on the P&L even if the system is working.")

add_body("Not all agencies are good. Most of them, honestly, are bad. If they don't specialize in promo, they'll spend months testing strategies that don't fit the industry. If they lock you into a twelve-month contract before proving anything, that's a red flag. If they can't show you real case studies with qualified meetings booked for companies like yours, move on.")

add_body("And there's the conflict of interest question. If the agency works with other promo companies, you need to make sure they're not reaching the same prospects on behalf of your competitors. Any agency worth working with will de-duplicate leads across clients and be transparent about how they handle this.")

# ============ WHO EACH IS BEST FOR ============
add_section_header('Who Each One Is Best For')
add_timestamp('[11:00 - 14:00]')

add_body("If you're a smaller promo company, under two million in revenue, and you have someone on your team who's willing to put in the work, a database makes sense. Not ZoomInfo though. Apollo or Prospeo will give you solid data for a tenth of the price. Learn a tool like Smartlead for sending. Set up your own domains. Write your own copy. You'll make mistakes and it'll take a few months, but at that size the budget might not be there for a full agency engagement. The DIY route is the move until you can afford to invest in a partner.")

add_body("If you're between roughly two million and a hundred million, an outbound agency is probably the better investment. And this is where I think the case is strongest.")

add_body("At this size, your sales reps have almost certainly become account managers. They handle reorders, service existing clients, follow up on quotes. They're not prospecting. You might tell them to, but it won't stick. Prospecting is a different skill than closing, and the modern tools required to do it well change every few months.")

add_body("Your marketing team is also not the answer. They're managing the website, trade shows, social media, catalogs. Building and running a cold outreach system that requires daily attention is a full-time role. They can't absorb that on top of everything else.")

add_body("You could try to hire someone internally for this. Finding a person who understands AI-powered prospecting tools, cold email deliverability, AND the branded merch industry is extremely difficult. That person barely exists. An agency that already specializes in promo gives you that expertise immediately without the hiring risk.")

add_body("And at this revenue level, the math works. If an agency books you 15 to 20 qualified meetings a month and you close even a couple of those into accounts that spend $50,000 to $100,000 a year, the return pays for the service many times over. The issue is never the cost. It's whether the agency can actually deliver. That's why specialization matters so much.")

add_body("If you're above a hundred million, you probably have internal teams that can handle parts of this. Marketing departments, SDR teams, demand gen people. You might still benefit from an outbound partner for specific campaigns or entering new markets, but you have the resources to build some of this in-house if you want to. At that scale it becomes more of a strategic choice than a necessity.")

# ============ HOW TO PICK AN AGENCY ============
add_section_header('If You Go The Agency Route')
add_timestamp('[14:00 - 15:30]')

add_body("Quick criteria because most agencies will waste your money.")

add_body("They should specialize in your industry. If they work with dentists and SaaS companies on the side, they don't understand promo. They're going to spend months testing what a specialized agency already knows.")

add_body("They should show you real results. Not email volume. Qualified meetings booked for companies similar to yours. Revenue generated. Actual proof.")

add_body("They should handle the full funnel. Research, infrastructure, messaging, replies, calling, booking, nurturing. If they just hand you a list of interested people and say good luck, that's ZoomInfo with a markup.")

add_body("Short commitment. You should be able to see results within the first month before you've committed to a full year.")

add_body("And they should be transparent about how they handle multiple clients in the same industry. Ask them directly.")

# ============ OUTRO ============
add_section_header('OUTRO')
add_timestamp('[15:30 - 16:00]')

add_body("So that's the honest breakdown. ZoomInfo gives you contacts. An outbound agency gives you meetings. Both have their place depending on where you are as a company.")

add_body("If you want to see how an outbound system would work for your specific branded merch company, there's a link in the description to book a call.")

add_body("Subscribe for more breakdowns like this. Peace.")

doc.save('/home/user/claude/scripts/zoominfo-vs-outbound-agency-script.docx')
print("Done")
