export interface Chapter {
  id: number;
  title: string;
  year: string;
  content: string;
  mood: 'peaceful' | 'mysterious' | 'adventurous' | 'nostalgic' | 'dramatic';
  visualFocus: 'wide' | 'intimate' | 'ethereal' | 'dynamic';
  imageElements?: {
    floating?: string[];
    parallax?: string[];
    foreground?: string;
  };
}

export const expandedStoryChapters: Chapter[] = [
  {
    id: 1,
    title: "First Light",
    year: "1895",
    content: `Dawn breaks over Twofold Bay.
    
    Salt mist. Ancient waters.`,
    mood: 'mysterious',
    visualFocus: 'ethereal',
    imageElements: {
      floating: ['/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_0bc26.webp'],
    }
  },
  {
    id: 2,
    title: "The Arrival",
    year: "1895",
    content: `A dorsal fin cuts the horizon.
    
    Old Tom approaches.
    
    The whalers hold their breath.`,
    mood: 'mysterious',
    visualFocus: 'wide',
    imageElements: {
      parallax: ['/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_92a3d.webp'],
    }
  },
  {
    id: 3,
    title: "Recognition",
    year: "1896",
    content: `Eyes meet across species.
    
    Understanding dawns.`,
    mood: 'peaceful',
    visualFocus: 'intimate',
    imageElements: {
      floating: ['/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_9c8df.webp'],
    }
  },
  {
    id: 4,
    title: "The Proposal",
    year: "1900",
    content: `Three tail slaps on water.
    
    WHACK. WHACK. WHACK.
    
    A language is born.`,
    mood: 'adventurous',
    visualFocus: 'dynamic',
    imageElements: {
      foreground: '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_8d9d2.webp',
    }
  },
  {
    id: 5,
    title: "The Law",
    year: "1900",
    content: `Tongue and lips for the pod.
    
    The rest for the men.
    
    The Law of the Tongue begins.`,
    mood: 'peaceful',
    visualFocus: 'wide',
    imageElements: {
      parallax: [
        '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_c616d.webp',
        '/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_e4890.webp'
      ],
    }
  },
  {
    id: 6,
    title: "Brothers of the Hunt",
    year: "1905",
    content: `Man and orca.
    
    Rope and tooth.
    
    One purpose.`,
    mood: 'adventurous',
    visualFocus: 'dynamic',
  },
  {
    id: 7,
    title: "Deep Trust",
    year: "1910",
    content: `Thirty feet below.
    
    Old Tom guides the boats
    through fog thick as wool.`,
    mood: 'mysterious',
    visualFocus: 'ethereal',
    imageElements: {
      floating: ['/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_ef32a.webp'],
    }
  },
  {
    id: 8,
    title: "The Storm Rises",
    year: "1920",
    content: `Black clouds swallow the sun.
    
    Waves like mountains.
    
    Jackie Davidson's boat turns turtle.`,
    mood: 'dramatic',
    visualFocus: 'wide',
    imageElements: {
      parallax: ['/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_df7fb.webp'],
    }
  },
  {
    id: 9,
    title: "Beneath the Chaos",
    year: "1920",
    content: `In the churning darkness,
    
    a massive shadow rises.
    
    Old Tom.`,
    mood: 'dramatic',
    visualFocus: 'intimate',
  },
  {
    id: 10,
    title: "The Carrying",
    year: "1920",
    content: `Six hours.
    
    Man on orca's back.
    
    Breathing together.`,
    mood: 'peaceful',
    visualFocus: 'intimate',
    imageElements: {
      floating: ['/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_75a07.webp'],
    }
  },
  {
    id: 11,
    title: "Worn Teeth",
    year: "1928",
    content: `Decades of rope-pulling
    
    have taken their toll.
    
    Old Tom swims slower now.`,
    mood: 'nostalgic',
    visualFocus: 'intimate',
  },
  {
    id: 12,
    title: "Last Dance",
    year: "1930",
    content: `September 17th.
    
    One final hunt.
    
    The old partners work as one.`,
    mood: 'nostalgic',
    visualFocus: 'wide',
    imageElements: {
      parallax: ['/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_e00d0.webp'],
    }
  },
  {
    id: 13,
    title: "Into the Deep",
    year: "1930",
    content: `Old Tom turns seaward.
    
    His pod calls from beyond the shelf.
    
    Time to go home.`,
    mood: 'peaceful',
    visualFocus: 'ethereal',
  },
  {
    id: 14,
    title: "The Return",
    year: "1930",
    content: `Three days later.
    
    Gentle waves carry him ashore.
    
    Even in death, Old Tom comes back.`,
    mood: 'nostalgic',
    visualFocus: 'intimate',
    imageElements: {
      floating: ['/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_62411.webp'],
    }
  },
  {
    id: 15,
    title: "Bones and Memory",
    year: "Today",
    content: `In Eden Killer Whale Museum,
    
    his skeleton tells the story.
    
    Worn teeth. Deep grooves. Truth.`,
    mood: 'peaceful',
    visualFocus: 'wide',
    imageElements: {
      parallax: ['/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_3b114.webp'],
    }
  },
  {
    id: 16,
    title: "Living Legend",
    year: "Forever",
    content: `When trust flows both ways,
    
    miracles swim
    
    in ordinary waters.`,
    mood: 'peaceful',
    visualFocus: 'ethereal',
    imageElements: {
      floating: [
        '/images/flux-ghibli/2025-07-21_FLUX_1-schnell-infer_Image_2744d.webp',
        '/images/flux-ghibli/2025-07-31_FLUX_1-schnell-infer_Image_c616d.webp'
      ],
    }
  }
];