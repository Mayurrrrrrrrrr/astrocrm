import random
from datetime import datetime

class VedicAstroService:
    """
    Service to interact with Vedic Astrology APIs.
    Currently using MOCK data for demonstration.
    """
    
    @staticmethod
    def generate_chart_svg(birth_data):
        """
        Generates a North Indian style kundli chart SVG.
        """
        # Mock parameters based on birth details to make it deterministic but variable
        seed = int(birth_data.get('date_of_birth').replace('-', ''))
        random.seed(seed)
        
        ascendant = random.choice(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'])
        planets = ['Sun', 'Mon', 'Mar', 'Mer', 'Jup', 'Ven', 'Sat', 'Rah', 'Ket']
        
        # Simple SVG template for North Indian Chart (Diamond style)
        svg = f"""
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style="background:transparent;">
            <!-- Outer Border -->
            <rect x="2" y="2" width="396" height="396" fill="None" stroke="#FFD700" stroke-width="2"/>
            
            <!-- Diagonals -->
            <line x1="0" y1="0" x2="400" y2="400" stroke="#FFD700" stroke-width="1.5"/>
            <line x1="400" y1="0" x2="0" y2="400" stroke="#FFD700" stroke-width="1.5"/>
            
            <!-- Diamond Inners -->
            <line x1="0" y1="200" x2="200" y2="0" stroke="#FFD700" stroke-width="1.5"/>
            <line x1="200" y1="0" x2="400" y2="200" stroke="#FFD700" stroke-width="1.5"/>
            <line x1="400" y1="200" x2="200" y2="400" stroke="#FFD700" stroke-width="1.5"/>
            <line x1="200" y1="400" x2="0" y2="200" stroke="#FFD700" stroke-width="1.5"/>

            <!-- House Numbers (Fixed positions for North Indian Chart) -->
            <text x="200" y="80" fill="#AAA" font-size="12" text-anchor="middle">1</text>
            <text x="100" y="30" fill="#AAA" font-size="12" text-anchor="middle">2</text>
            <text x="40" y="80" fill="#AAA" font-size="12" text-anchor="middle">3</text>
            <text x="100" y="160" fill="#AAA" font-size="12" text-anchor="middle">4</text>
            <text x="40" y="300" fill="#AAA" font-size="12" text-anchor="middle">5</text>
            <text x="100" y="350" fill="#AAA" font-size="12" text-anchor="middle">6</text>
            <text x="200" y="300" fill="#AAA" font-size="12" text-anchor="middle">7</text>
            <text x="300" y="350" fill="#AAA" font-size="12" text-anchor="middle">8</text>
            <text x="360" y="300" fill="#AAA" font-size="12" text-anchor="middle">9</text>
            <text x="300" y="160" fill="#AAA" font-size="12" text-anchor="middle">10</text>
            <text x="360" y="80" fill="#AAA" font-size="12" text-anchor="middle">11</text>
            <text x="300" y="30" fill="#AAA" font-size="12" text-anchor="middle">12</text>

            <!-- Ascendant -->
            <text x="200" y="110" fill="#FF6B35" font-size="14" font-weight="bold" text-anchor="middle">Asc: {ascendant}</text>
            
            <!-- Random Planets Placement Mock -->
            <text x="100" y="130" fill="#FFF" font-size="12" text-anchor="middle">Sun</text>
            <text x="300" y="130" fill="#FFF" font-size="12" text-anchor="middle">Jup</text>
            <text x="200" y="270" fill="#FFF" font-size="12" text-anchor="middle">Ven</text>
        </svg>
        """
        return svg.strip()

    @staticmethod
    def get_daily_horoscope(sign):
        """
        Returns a mock daily horoscope for the sign.
        """
        predictions = [
            "Today is a great day for new beginnings. Focus on your goals.",
            "You might face some minor challenges, but your patience will pay off.",
            "Financial gains are indicated. Be wise with your investments.",
            "Health looks good. Try to include some yoga in your routine.",
            "Travel is on the cards. Pack your bags!",
            "Relationship harmony is highlighted today. Spend time with loved ones."
        ]
        return {
            "sign": sign,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "prediction": random.choice(predictions),
            "lucky_number": random.randint(1, 9),
            "lucky_color": random.choice(["Red", "Blue", "Green", "Yellow", "White"])
        }
