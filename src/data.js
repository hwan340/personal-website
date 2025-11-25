export const profile = {
  name: "Dr. Haozhe Zac Wang",
  title: "Neural Scientist & Engineer",
  bio: "Understanding the brain, one neuron at a time.",
  socials: [
    { name: "GitHub", url: "https://github.com/hwan340", icon: "🐙" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/haozhe-wang-1332aa14a/", icon: "💼" }
  ]
};

export const papers = [
  {
    id: 1,
    title: "A novel simulation paradigm utilising MRI-derived phosphene maps for cortical prosthetic vision",
    journal: "Journal of Neural Engineering",
    year: "2023",
    link: "https://iopscience.iop.org/article/10.1088/1741-2552/aceca2",
    summary: "Objective. We developed a realistic simulation paradigm for cortical prosthetic vision and investigated whether we can improve visual performance using a novel clustering algorithm. Approach. Cortical visual prostheses have been developed to restore sight by stimulating the visual cortex. To investigate the visual experience, previous studies have used uniform phosphene maps, which may not accurately capture generated phosphene map distributions of implant recipients. The current simulation paradigm was based on the Human Connectome Project retinotopy dataset and the placement of implants on the cortices from magnetic resonance imaging scans. Five unique retinotopic maps were derived using this method. To improve performance on these retinotopic maps, we enabled head scanning and a density-based clustering algorithm was then used to relocate centroids of visual stimuli. The impact of these improvements on visual detection performance was tested. Using spatially evenly distributed maps as a control, we recruited ten subjects and evaluated their performance across five sessions on the Berkeley Rudimentary Visual Acuity test and the object recognition task. Main results. Performance on control maps is significantly better than on retinotopic maps in both tasks. Both head scanning and the clustering algorithm showed the potential of improving visual ability across multiple sessions in the object recognition task. Significance. The current paradigm is the first that simulates the experience of cortical prosthetic vision based on brain scans and implant placement, which captures the spatial distribution of phosphenes more realistically. Utilisation of evenly distributed maps may overestimate the performance that visual prosthetics can restore. This simulation paradigm could be used in clinical practice when making plans for where best to implant cortical visual prostheses."
  },
  {
    id: 2,
    title: "Raster Scanning Can Improve Task Performance in Simulated Prosthetic Vision",
    journal: "IEEE Transactions on Neural Systems and Rehabilitation Engineering",
    year: "2025",
    link: "https://ieeexplore.ieee.org/document/11193827",
    summary: "Current challenges exist for cortical visual prostheses in presenting complex visual scenes. One of the major constraints is the number of electrodes that can be stimulated simultaneously, due to issues with electrical interaction between electrodes and the resulting complications in visual perception. To overcome this, studies have presented the outline of objects sequentially. However, this method has only been tested with simple visual stimuli, such as letters. We combined the strengths of both simultaneous and sequential presentation of phosphenes via a novel stimulation protocol named raster scanning. We tested this method using simulated prosthetic vision with a Virtual Reality headset and evaluated participants’ visual abilities over three tasks. We recorded head movement data to investigate the various strategies participants employed to explore the visual scene. We found that raster scanning could improve task accuracy and reduce response time across three tasks. Moreover, raster scanning required less head movement to complete tasks. These results suggest that raster scanning binds visual cues more efficiently than head scanning alone. Our findings underscore the importance of sequentially presenting visual information and confirm the potential of cortical visual prostheses to provide functional vision, even under the current spatial and temporal constraints."
  }
];

export const interests = [
  { name: "Hiking", emoji: "🏔️", desc: "Exploring nature in Australasia." },
  { name: "Japanese", emoji: "🏯🍡", desc: "Learning catch phrase and enjoying yakitori." },
  { name: "Meditation", emoji: "🧘", desc: "Finding calmness in chaos." }
];

export const experience = [
  { role: "PhD Researcher, Teaching Assistant", company: "Monash University", year: "2021-2025" },
  { role: "Bachelor of Engineering and Bachelor of Science", company: "Monash University", year: "2017-2021" }
];