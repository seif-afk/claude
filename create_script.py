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
add_timestamp('[0:00 - 0:30]')

add_body("My agency works with Swag.com, Imprint Engine, and we've booked almost 500 sales meetings for promo companies in three months including leads from HubSpot, Hilton, Uber, Stripe, and Charter Communications.")

add_body("A lot of the promo companies I talk to are either already on ZoomInfo or they're deciding between ZoomInfo and hiring an outbound agency. So I want to give you the honest comparison so you can figure out which one fits your situation.")

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

add_body("Now I want to be clear. This is what a full-service outbound agency does. Not all agencies do all of this. Some just send you leads and call it a day. But a proper full-service one handles everything from start to finish:")

add_talking_point("They do the research to figure out who you should be targeting and what offer to reach out with. Looking at your past clients, your industry, building a strategy around that.")
add_talking_point("They build the prospect lists using B2B databases and tools to find the right companies and decision makers.")
add_talking_point("They figure out which prospects are more likely to need promo right now versus eventually, so the outreach goes to the right people at the right time.")
add_talking_point("They set up the infrastructure for doing outreach at scale across email, LinkedIn, and calling. Domains, inboxes, warm-up, automation tools, power dialers, the whole technical setup that most teams don't know how to build.")
add_talking_point("They write the messaging, manage campaigns daily, handle replies, qualify interested leads, and book the meeting directly on your salesperson's calendar.")
add_talking_point("Before the meeting, they send the prospect relevant materials so they have context going in.")
add_talking_point("Your salesperson just shows up and closes. That's the whole thing from research to booked meeting.")

# ============ PROS AND CONS OF ZOOMINFO ============
add_section_header('Pros and Cons of ZoomInfo')
add_timestamp('[5:00 - 7:30]')

add_body("Pros:")
add_talking_point("You own the data. Export the contacts, yours forever, use them anywhere.")
add_talking_point("Full control over messaging and brand. Nobody emails prospects with your name unless you wrote it.")
add_talking_point("Can be cheaper than an agency if you already have a team that knows how to prospect. Big if.")
add_talking_point("Secondary uses: enriching CRM data, researching companies before meetings.")

add_body("Cons:")
add_talking_point("Data quality is not great. People change jobs, emails go dead. One prospect told me he found contacts who had retired or passed away. A lot of the data is stale.")
add_talking_point("It gives you contacts but zero system. You still need infrastructure, messaging, deliverability, everything. If your team can't run cold outreach, the data sits in a spreadsheet.")
add_talking_point("A promo company sent 5,000 emails from ZoomInfo contacts and booked 3 meetings. Generic messaging, no targeting, sent from HubSpot. Landed in spam.")
add_talking_point("It's overpriced. Prospeo, Apollo, Ocean.io offer comparable data at a fraction of the cost.")

# ============ PROS AND CONS OF OUTBOUND AGENCY ============
add_section_header('Pros and Cons of an Outbound Agency')
add_timestamp('[7:30 - 11:00]')

add_body("Pros:")
add_talking_point("Saves you time and money. They already know what works so there's no testing phase. Every failed campaign you run yourself costs burned domains and months of nothing.")
add_talking_point("Bridges the skill gap. Modern outbound is a full-time specialty. Your reps and marketing team aren't keeping up with it.")
add_talking_point("Frees up your team to handle more leads and actually close them. More meetings coming in AND more capacity to convert. That compounds.")

add_body("Cons:")
add_talking_point("You give up some control over messaging and brand. Requires trust.")
add_talking_point("Higher monthly cost than a database. Harder to justify for smaller companies.")
add_talking_point("Meetings book fast but the promo sales cycle is long. ROI takes a few months to show.")
add_talking_point("Most agencies are bad. If they don't specialize in promo, they waste months.")
add_talking_point("Conflict of interest if they work with other promo companies. Make sure they're not hitting the same prospects.")

# ============ WHO EACH IS BEST FOR ============
add_section_header('Who Each One Is Best For')
add_timestamp('[11:00 - 14:00]')

add_body("Under $2M:")
add_talking_point("Database is the right move. Not ZoomInfo though. Apollo or Prospeo for a tenth of the price. Learn Smartlead. DIY it. Budget probably isn't there for an agency yet.")

add_body("$2M to $100M:")
add_talking_point("Outbound agency wins. Your reps have become account managers. Your marketing team is stretched. Neither is going to build and run a daily outreach operation.")
add_talking_point("You could hire a GTM engineer internally. But it's not just salary. It's payroll taxes, benefits, medical, training, management, and the risk they leave in six months. All in, $13K-$15K a month for one person. An agency costs less and comes with a full team, tools included, proven system, no ramp-up.")
add_talking_point("If an agency books you 15-20 meetings a month and you close a couple into $50K-$100K annual accounts, the return pays for the service many times over.")

add_body("Above $100M:")
add_talking_point("Hiring a GTM engineer in-house makes sense at this size. You have the budget, infrastructure, and volume to justify it. An agency can still help with specific campaigns but building internally is a real option here.")

# ============ HOW TO PICK AN AGENCY ============
add_section_header('How To Pick The Right Agency')
add_timestamp('[14:00 - 15:30]')

add_talking_point("They specialize in promo. If they don't know the industry, they'll waste months testing what a specialized agency already knows.")
add_talking_point("Short commitment. Results within the first month. If they want 6-12 months upfront, walk away.")
add_talking_point("They guarantee meetings, not just leads. They should tell you exactly how many qualified meetings to expect.")
add_talking_point("ROI maps out to at least 10x your investment. If they can't walk you through the math based on your deal size, red flag.")
add_talking_point("Real case studies. Actual meetings booked and deals closed for companies like yours. Not 'we sent 50,000 emails.'")
add_talking_point("Smaller, leaner team. Not a massive company that hands you off to a random account manager. You want people heavily focused on your account.")
add_talking_point("Full funnel. Research, infrastructure, messaging, replies, calling, booking, nurturing. If they just hand you leads and say good luck, that's ZoomInfo with a markup.")

# ============ OUTRO ============
add_section_header('OUTRO')
add_timestamp('[15:30 - 16:00]')

add_body("Netswick is that type of agency. If you want a custom outbound strategy built for your branded merch company, book a call with me below.")

add_body("Subscribe for more breakdowns like this. Peace.")

doc.save('/home/user/claude/scripts/zoominfo-vs-outbound-agency-script.docx')
print("Done")
