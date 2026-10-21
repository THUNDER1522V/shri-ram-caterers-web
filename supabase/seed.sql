-- ============================================================================
-- WHITE-LABEL HOSPITALITY CMS: SEED DATA
-- Seed: supabase/seed.sql
-- Tenant 01: Shri Ram Caterers (shriramcaterers.com)
-- ============================================================================

DO $$
DECLARE
    v_tenant_id UUID := 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    v_media_hero UUID := gen_random_uuid();
    v_media_live UUID := gen_random_uuid();
    v_media_buffet UUID := gen_random_uuid();
    v_media_dessert UUID := gen_random_uuid();
    v_media_chaat UUID := gen_random_uuid();
    v_media_cocktails UUID := gen_random_uuid();

    v_cat_weddings UUID := gen_random_uuid();
    v_cat_buffet UUID := gen_random_uuid();
    v_cat_live UUID := gen_random_uuid();
    v_cat_beverages UUID := gen_random_uuid();
    v_cat_themes UUID := gen_random_uuid();

    v_cuisine_awadhi UUID := gen_random_uuid();
    v_cuisine_rajwada UUID := gen_random_uuid();
    v_cuisine_punjabi UUID := gen_random_uuid();
    v_cuisine_kashmiri UUID := gen_random_uuid();
    v_cuisine_fusion UUID := gen_random_uuid();
    v_cuisine_mithai UUID := gen_random_uuid();

    v_counter_kulcha UUID := gen_random_uuid();
    v_counter_chaat UUID := gen_random_uuid();
    v_counter_biryani UUID := gen_random_uuid();
    v_counter_pizza UUID := gen_random_uuid();
    v_counter_jalebi UUID := gen_random_uuid();
    v_counter_mocktails UUID := gen_random_uuid();

    v_service_wedding UUID := gen_random_uuid();
    v_service_sangeet UUID := gen_random_uuid();
    v_service_live UUID := gen_random_uuid();
    v_service_destination UUID := gen_random_uuid();
    v_service_corporate UUID := gen_random_uuid();
    v_service_seasonal UUID := gen_random_uuid();

    v_faq_cat_general UUID := gen_random_uuid();
BEGIN
    -- 1. Insert Tenant 01
    INSERT INTO tenants (id, slug, legal_name, trade_name, business_type, status)
    VALUES (
        v_tenant_id,
        'shri-ram-caterers',
        'Shri Ram Caterers & Royal Banqueting Pvt. Ltd.',
        'Shri Ram Caterers',
        'caterer',
        'active'
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Insert Domains
    INSERT INTO tenant_domains (tenant_id, domain, is_primary, is_verified)
    VALUES 
        (v_tenant_id, 'shriramcaterers.com', true, true),
        (v_tenant_id, 'localhost', false, true)
    ON CONFLICT DO NOTHING;

    -- 3. Insert Tenant Settings
    INSERT INTO tenant_settings (
        tenant_id,
        tagline,
        description,
        logo_url,
        primary_color,
        secondary_color,
        phone_formatted,
        phone_raw,
        whatsapp_raw,
        whatsapp_prefilled_message,
        email,
        catering_inquiries_email,
        address_full,
        city,
        state,
        country,
        opening_hours,
        price_range,
        service_radius,
        social_links,
        feature_flags
    ) VALUES (
        v_tenant_id,
        'Royal Indian Wedding & Luxury Pure-Vegetarian Catering',
        'Premier luxury wedding caterers in Delhi NCR, Agra, Jaipur & North India. Curating bespoke royal banquets, artisanal live food theatres, and generational heritage recipes with flawless white-glove hospitality.',
        '/images/logo.png',
        '#C6A15B',
        '#4A0A10',
        '+91 99999 99999',
        '+919999999999',
        '+919999999999',
        'Hello Shri Ram Caterers, I am planning a celebration and would like to inquire about your luxury pure-vegetarian catering services.',
        'contact@shriramcaterers.com',
        'events@shriramcaterers.com',
        'Ring Road, New Delhi NCR & Serving Destination Palaces Across North India',
        'New Delhi',
        'Delhi NCR',
        'India',
        'Monday to Sunday: 9:00 AM – 10:00 PM IST',
        '₹₹₹₹',
        'Delhi NCR, Agra, Jaipur, Udaipur, Gwalior & Destination Venues Across India',
        '{"instagram": "https://instagram.com/shriramcaterers", "google_reviews": "https://maps.google.com/?cid=shriramcaterers", "youtube": "https://youtube.com/@shriramcaterers", "facebook": "https://facebook.com/shriramcaterers"}'::jsonb,
        '{"live_counters": true, "tasting_sessions": true, "video_coverflow": true, "pure_veg_guarantee": true}'::jsonb
    ) ON CONFLICT (tenant_id) DO NOTHING;

    -- 4. Insert Media Assets
    INSERT INTO media_assets (id, tenant_id, media_type, storage_path, poster_url, aspect_ratio, alt_text)
    VALUES
        (v_media_hero, v_tenant_id, 'video', '/videos/hero_video.mp4', '/images/hero-reel-poster.webp', '9/16', 'Bride Entry ceremony reel'),
        (v_media_live, v_tenant_id, 'video', '/videos/livecounter.mp4', '/posters/live-cooking.svg', '9/16', 'Live cooking theatre reel'),
        (v_media_buffet, v_tenant_id, 'video', '/videos/grand-wedding.mp4', '/images/grand-wedding-reception.png', '9/16', 'Grand Royal Buffet reel'),
        (v_media_dessert, v_tenant_id, 'video', '/videos/v1.mp4', '/posters/dessert-counter.svg', '9/16', 'Dessert counter reel'),
        (v_media_chaat, v_tenant_id, 'video', '/videos/bhelpuri.mp4', '/images/hero-reel-poster.webp', '9/16', 'Chaat bazaar reel'),
        (v_media_cocktails, v_tenant_id, 'video', '/videos/exotic-mocktails.mp4', '/images/grand-wedding-reception.png', '9/16', 'Welcome botanical bar reel')
    ON CONFLICT (id) DO NOTHING;

    -- 5. Insert Gallery Categories
    INSERT INTO gallery_categories (id, tenant_id, name, slug, display_order)
    VALUES
        (v_cat_weddings, v_tenant_id, 'Weddings', 'weddings', 1),
        (v_cat_buffet, v_tenant_id, 'Buffet Architecture', 'buffet-architecture', 2),
        (v_cat_live, v_tenant_id, 'Live Counters', 'live-counters', 3),
        (v_cat_beverages, v_tenant_id, 'Beverages', 'beverages', 4),
        (v_cat_themes, v_tenant_id, 'Themes & Decor', 'themes-decor', 5)
    ON CONFLICT DO NOTHING;

    -- 6. Insert Gallery Items
    INSERT INTO gallery_items (tenant_id, category_id, media_asset_id, title, description, event_name, location, event_date, event_date_formatted, tag, is_featured, display_order)
    VALUES
        (v_tenant_id, v_cat_weddings, v_media_hero, 'Celebrating Divyansh & Naina', 'An opulent royal wedding banquet featuring 1,400 guests, 12 live food theatres, and an extravagant Awadhi dastarkhwan.', 'Grand Wedding Reception', 'The Leela Palace, New Delhi', '2025-02-15', 'February 2025', 'Wedding Gala', true, 1),
        (v_tenant_id, v_cat_buffet, v_media_buffet, 'Royal Buffet Architecture', 'Multi-tier banquet layout designed with ambient brass warmers, floral arches, custom hand-carved stone risers, and seamless guest movement flow.', 'Luxury Reception Gala', 'Jaypee Greens, Greater Noida', '2025-01-20', 'January 2025', 'Buffet Display', true, 2),
        (v_tenant_id, v_cat_live, v_media_chaat, 'Live Chef Culinary Theatre', 'High-energy interactive chaat counters serving kullhad tamatar chaat, hand-churned butter kulchas, and crisp palak patta chaat.', 'Sangeet & Cocktail Evening', 'ITC Maurya, New Delhi', '2024-12-10', 'December 2024', 'Live Food Theatre', true, 3),
        (v_tenant_id, v_cat_beverages, v_media_cocktails, 'Exotic Welcome Mocktails', 'Artisanal botanical cordial welcome bar featuring smoked jamun shots, kesar kasturi sharbats, and sub-zero liquid nitrogen clouds.', 'Palace Welcome Gala', 'Taj Hotel & Convention Centre, Agra', '2024-11-18', 'November 2024', 'Welcome Bar', false, 4)
    ON CONFLICT DO NOTHING;

    -- 7. Insert Cuisines
    INSERT INTO cuisine_regions (id, tenant_id, slug, title, region, tagline, description, cover_image_url, video_url, dietary_badges, display_order)
    VALUES
        (v_cuisine_awadhi, v_tenant_id, 'awadhi-dastarkhwan', 'Royal Awadhi Dastarkhwan', 'Awadh (Lucknow)', 'The Poetry of Dum Pukht & Subtle Aromatics', 'Celebrated for its gentle perfume of kewra, saffron, and slow coal-steaming.', '/images/grand-wedding-reception.png', '/videos/grand-wedding.mp4', ARRAY['100% Pure Veg', 'Jain Option Available', 'Royal Heritage'], 1),
        (v_cuisine_rajwada, v_tenant_id, 'rajasthani-rajwada', 'Rajasthani Rajwada Thali', 'Rajasthan', 'Fortress Feasts & Rich Heritage Spices', 'An opulent royal spread honoring Marwari and Rajputana traditions.', '/images/hero-reel-poster.webp', '/videos/themes-and-counters.mp4', ARRAY['100% Pure Veg', 'Pure Desi Ghee', 'Traditional Recipe'], 2),
        (v_cuisine_punjabi, v_tenant_id, 'punjabi-shahi-dawat', 'Grand Punjabi Shahi Dawat', 'Punjab', 'Hearty Robust Tastes of Northern Soil', 'Celebratory feasts rich in wood-charred cottage cheese and slow-simmered black lentils.', '/images/grand-wedding-reception.png', '/videos/livecounter.mp4', ARRAY['100% Pure Veg', 'Clay Tandoor', 'North Indian Classic'], 3),
        (v_cuisine_kashmiri, v_tenant_id, 'kashmiri-wazwan', 'Kashmiri Pure-Vegetarian Wazwan', 'Kashmir', 'Fragrant Spices of the Valley & Himalayan Herbs', 'A rare pure-vegetarian adaptation of Kashmir iconic feast with saffron and sun-dried ginger.', '/images/hero-reel-poster.webp', '/videos/bhelpuri.mp4', ARRAY['100% Pure Veg', 'Himalayan Herbs', 'Sattvic Friendly'], 4),
        (v_cuisine_fusion, v_tenant_id, 'contemporary-global', 'Artisanal Contemporary & Global Fusion', 'Pan-Asian & Mediterranean', 'World Flavors Crafted for the Royal Indian Palate', 'Modern culinary architecture featuring crystal dim sums and truffle mushroom risotto.', '/images/grand-wedding-reception.png', '/videos/v1.mp4', ARRAY['100% Pure Veg', 'Live Dim Sum', 'Modern Fusion'], 5),
        (v_cuisine_mithai, v_tenant_id, 'royal-mithai', 'Artisan Royal Mithai & Halwai Kadai', 'Mithai Confections', 'The Golden Crescendo of Indian Celebrations', 'Live saffron jalebis, slow-churned seasonal fruit kulfis, and gold-dusted regional confections.', '/images/hero-reel-poster.webp', '/videos/mango.mp4', ARRAY['100% Pure Veg', 'A2 Cow Ghee', 'No Preservatives'], 6)
    ON CONFLICT DO NOTHING;

    -- 8. Insert Menu Items for Awadhi
    INSERT INTO menu_items (tenant_id, cuisine_region_id, name, course_type, description, is_pure_veg, is_jain_available, is_signature, display_order)
    VALUES
        (v_tenant_id, v_cuisine_awadhi, 'Melt-in-Mouth Subz Galouti Kebabs', 'starter', 'Delicate smoked vegetable galoutis served on miniature ulte tawe ka parathas with mint relish.', true, true, true, 1),
        (v_tenant_id, v_cuisine_awadhi, 'Shahi Badami Paneer in White Saffron Gravy', 'main_course', 'Handmade cottage cheese cubes slow-poached in ground almond, cardamom, and Kashmiri saffron gravy.', true, true, true, 2),
        (v_tenant_id, v_cuisine_awadhi, '24-Hour Simmered Dal Sultani', 'main_course', 'Rich yellow lentils infused with milk, cream, and smoked cloves in pure ghee.', true, true, false, 3)
    ON CONFLICT DO NOTHING;

    -- 9. Insert Live Counters
    INSERT INTO live_counters (id, tenant_id, slug, tag, title, badge, description, chef_note, video_url, display_order)
    VALUES
        (v_counter_kulcha, v_tenant_id, 'amritsari-kulcha', 'Clay Tandoor Master', 'Amritsari Kulcha & Pindi Chole Theatre', 'Guest Favorite', 'Authentic clay-oven blistered kulchas served piping hot with 12-hour slow-simmered chole.', 'Prepared live in traditional clay tandoors at 350°C', '/videos/livecounter.mp4', 1),
        (v_counter_chaat, v_tenant_id, 'chaat-bazaar', 'Heritage Street Food', 'Grand Banarasi Chaat Bazaar', 'Signature Station', 'Opulent celebration of Banaras chaat heritage with kullhad tamatar chaat and crisp palak patta chaat.', 'Crafted with pure desi ghee and house-ground masalas', '/videos/bhelpuri.mp4', 2),
        (v_counter_biryani, v_tenant_id, 'awadhi-biryani', 'Royal Dum Pukht', 'Royal Awadhi Dum Biryani & Tawa Counter', 'Royal Speciality', 'Clay handi sealed aromatic basmati rice layered with seasonal vegetables and slow-steamed over coal.', 'Handis unsealed fresh on your banquet floor', '/videos/buffet-architecture.mp4', 3),
        (v_counter_jalebi, v_tenant_id, 'jalebi-rabri', 'Heritage Mithai Live', 'Golden Saffron Jalebi & Lachedar Rabri', 'Sweet Finale', 'Crisp saffron spirals fried live in bubbling pure cow ghee, served with rich 6-hour reduced rabri.', '100% A2 Pure Desi Ghee preparation guaranteed', '/videos/mango.mp4', 4)
    ON CONFLICT DO NOTHING;

    -- 10. Insert Services
    INSERT INTO services (id, tenant_id, slug, tag, title, description, capacity_range, video_url, poster_url, display_order)
    VALUES
        (v_service_wedding, v_tenant_id, 'wedding-catering', 'Primary Specialization', 'Grand Wedding Receptions', 'Complete luxury wedding banquets designed to honor royal dining traditions with multi-tier grand buffet architecture.', '500 to 5,000+ Guests', '/videos/grand-wedding.mp4', '/images/hero-reel-poster.webp', 1),
        (v_service_sangeet, v_tenant_id, 'pre-wedding-sangeet', 'Pre-Wedding Celebrations', 'Sangeet, Mehendi & Cocktails', 'High-energy, interactive dining featuring artisan street food stations, live sizzlers, and craft mocktail bars.', '150 to 1,500 Guests', '/videos/v1.mp4', '/posters/live-cooking.svg', 2),
        (v_service_destination, v_tenant_id, 'destination-wedding', 'Heritage & Destination', 'Destination Weddings & Palaces', 'Comprehensive mobile commercial kitchens and master chef convoys deployed across Rajasthan and North India palace estates.', 'Multi-Day Banquets', '/videos/themes-and-counters.mp4', '/posters/final-venue.svg', 3)
    ON CONFLICT DO NOTHING;

    -- 11. Insert Reviews
    INSERT INTO reviews (tenant_id, review_type, author_name, author_role, event_type, location, rating, quote, is_verified, review_date_formatted, is_published, display_order)
    VALUES
        (v_tenant_id, 'google', 'Aditya Sharma', 'Local Guide • 13 reviews', 'Grand Wedding Reception (1,200 Guests)', 'New Delhi', 5.0, 'We had an absolutely wonderful experience with Shree Ram Caterers. The service provided was truly amazing and exceeded all our expectations. Every dish served was incredibly tasty and prepared with evident care and quality ingredients.', true, '10 months ago', true, 1),
        (v_tenant_id, 'google', 'Tanvi Agarwal', 'Local Guide • 7 reviews', 'Sangeet & Cocktail Night (800 Guests)', 'Agra', 5.0, 'Shri Ram Caterers provided outstanding catering for our family event! The food was delicious, beautifully presented, and served on time. The team was professional, attentive, and made sure everything went smoothly.', true, 'a year ago', true, 2),
        (v_tenant_id, 'video', 'The Gupta Family', 'Host Family', 'Grand Wedding Gala', 'Delhi NCR', 5.0, 'Pure vegetarian perfection. Exceeded every expectation our elders had.', true, 'December 2024', true, 3)
    ON CONFLICT DO NOTHING;

    -- 12. Insert FAQs
    INSERT INTO faqs (tenant_id, question, answer, display_order, is_published)
    VALUES
        (v_tenant_id, 'Are your kitchens strictly 100% Pure Vegetarian?', 'Yes, absolutely without exception. Shri Ram Caterers operates strictly pure-vegetarian kitchens. All cooking vessels, commercial mobile kitchens, ladles, and transport containers are 100% vegetarian. We also offer dedicated separate preparation areas and counters for Jain (onion-and-garlic-free) and Sattvic culinary requests.', 1, true),
        (v_tenant_id, 'What guest capacities do you accommodate?', 'We cater celebrations ranging from intimate pre-wedding gatherings of 100 guests to monumental wedding banquets and corporate galas exceeding 5,000+ guests with synchronized multi-tier service lines.', 2, true),
        (v_tenant_id, 'Do you offer food tasting sessions before final booking?', 'Yes. Once your event date and primary requirements are discussed, we arrange an exclusive private tasting session for the host family to sample signature gravies, live counter starters, and artisanal desserts.', 3, true)
    ON CONFLICT DO NOTHING;

    -- 13. Insert Process Steps
    INSERT INTO process_steps (tenant_id, step_number, title, subtitle, description, highlights, icon_name, display_order)
    VALUES
        (v_tenant_id, '01', 'Private Tasting & Menu Curation', 'Personalized Consultation with Senior Master Chefs', 'We welcome the host family to an exclusive private tasting session to sample gravies, live counter starters, and artisanal desserts.', ARRAY['Interactive multi-course sampling session', 'Customization for Jain, Vegan & Sattvic guests', 'Selection of seasonal specialty produce'], 'Utensils', 1),
        (v_tenant_id, '02', 'Architectural Layout & Styling', 'Banquet Flow Mapping & Thematic Live Station 3D Design', 'Our banquet directors collaborate with your wedding decorators to map out guest traffic flow, brass chafing lines, and live counter aesthetics.', ARRAY['Optimized layout to eliminate buffet queues', 'Thematic brass, copper, or contemporary styling', 'Dedicated VIP and family dining zones'], 'Layers', 2),
        (v_tenant_id, '03', 'Farm-to-Table Artisanal Sourcing', 'Triple-Inspected Pure Ingredients & Stone-Ground Spices', 'We source peak-fresh organic seasonal produce, cold-pressed oils, pure A2 cow ghee, and hand-selected whole spices.', ARRAY['Zero artificial colors or preservatives', 'Daily farm-direct dairy and cottage cheese', 'Temperature-monitored refrigerated transport'], 'CheckCircle', 3),
        (v_tenant_id, '04', 'White-Glove Banquet Execution', 'Synchronized Service & Senior Floor Captaincy', 'On event day, our master chefs and uniformed captains deploy 6 hours in advance, ensuring piping hot food from first arrival to the last departing guest.', ARRAY['Live cooking theatres fired in real time', 'Continuous hot food replenishments without lag', 'White-glove silver service for elder tables'], 'Sparkles', 4)
    ON CONFLICT DO NOTHING;

END $$;
