import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

interface SearchResult {
  title: string;
  subtitle: string;
  image: string;
  type: 'movie' | 'tv';
  year: string;
}

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  imports: [IonContent, RouterLink, FormsModule],
})
export class SearchPage {
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4YV5ni1aKb4BqdMdcucLHbKZy_ZYbTt67rWT2Cc_BdCRMUn-sbw1t_FWDrR4q6H87ir5CwIu-FZ4-htLBswHRwwwLphQJo4vIReCmkNAP_qgX56_M9otTW7uga_mub84fDbDQcBj7ULcdYenGX4aj9frRDfS3uid7p3St1FsozDHLpdGnfkkcYXUfKTfy8UjYBruezKaEuh7sLIQU5_iIGW4Z89YdYRTIWsZwuAfHfccJABnC8kIICwnjxXkgCPWC_8jUpZaNb-M';

  query = '';
  allItems: SearchResult[] = [
    { title: 'Interstellar Odyssey', subtitle: 'Sci-Fi Thriller', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhyXIPEueFHsrDkiJKbjJzKa3rNGFExCtdSABuEO6oAb2Ud2fnIclYfibd2cBxlJcNdPln5Jqtet3ujim3sogN6FCoEBtWpkNyc0p5LXjXPPiv4KjWU6bg87F-nfc8P28vJHennPjb68U8OwiCkYGBiNpcio3yeBW1sQLYsqIye1v-qdb_cd51vWdL9002IEHTHZnjkIzn9_ARIrOAsrZzG5cgcNIW4E4DyIfYYF3h1tN04su-ITUM9tkPuzNMcK9KMrPAsblonIQ', type: 'movie', year: '2024' },
    { title: 'The Midnight Rain', subtitle: 'Drama Series', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU0VWurJKXuz_2WpMZqhVA_T9nDecLwMuFKGQ_TnlfgLoxHpSNoXfxB8v4uWjTacJtpHYw8mz0fhxdiSCY4xwTAf5hl_rYutwJRIAeWsQ377Qowuu3ArfSVemu9e7jnG4yzOaJEwyV6sgSmn7lNiE4pHix7EYOL1zOkta6FJiGk5JaQyOl2GLG3zWaXhHUTwvWycYfrt8_ioEDvu-bJou13WNuA_KJ__NHCK8YWUoNmTRIubSC1xpXZ7jQ8Hwhfv6pbwZkrFrPDEc', type: 'tv', year: '2023' },
    { title: 'Digital Horizons', subtitle: 'Tech Documentary', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgfOmKsb3WI6nIYzP6zgQdYmAvbYK54XW--i309ShIMKYCMiAJxQD5bLVsTu5Pxqj8R6vXxEsEWVXs_J-iDEqW5n06NJBn9pJe8CvyrTLaqC7WfO395GlbnUWMXap8ScUL-JbMdet2x4284XAHjYCp2JoV00k3klAq8Zrsy_2WkNIbHsENheKQaCuYu0JNl4AUUiFikHdddhSmnuTr_Zva8aHAUKNc8sxfVvWrb-fi4sG4dI2qoXuwXGioxgZ_dAWLTiN-24RQqOw', type: 'movie', year: '2025' },
    { title: 'Stranger Horizons', subtitle: 'Sci-Fi Series', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTdiAoDJzPB4AGwLz0a0JDOeD3ElJGNapfULHuPOJyVB1HGJdUXLxLx5le_cYJC9w2wIS5-H1N3RI8hcjhoojTcajrEVVNuw60PN0tVkf49uyVJjg1nYTFoi48jAdSfq3ofHWy1YVbyJJxjp0r7sD5axUyqfzkTuyt07NjAk1f7JbYkazN2BljPUK9vAeBoeQAQf3mW0PKTPUzQHORPF6WxhryLHlIHmckcBSmBVQ2_TDyWcikw6bfuSnrMCkLDUylf2ZljkxlAzQ', type: 'tv', year: '2024' },
    { title: 'Nightfall Protocol', subtitle: 'Action Thriller', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMNo2L0rSWx3wTX7uLL1rb_HB2TX0egfhXHmZDrXGTnaxYxn6kds7meu9ix3_iype_vLTrZDQAaeZ3t9glMGNnIccnvLManP73xvkBBmYAHXq3oKZ11PIHKqu4GfZxmec4j1SFK-L7IW4onGiCRxmHXbX9-Iv69Nhku__3rrayxzGbmo68pucQBo8ts5W-Q8fDVRhJSYRg5qt3a2mjqKJu_6MzRP_Rf72dLimdu0zBXH_AfF6BzPqh4ohQX-7U3x-Zn4sDLgGAcd8', type: 'movie', year: '2024' },
    { title: 'Kingdom of Dust', subtitle: 'Post-Apocalyptic Series', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLbb7H77mIDgsMWyR4maO12AEKOiK1RWLBwUUxLrJ3f5X2DX-BohhP5nStyW5nl-oa3SYPXQy0FgrI0x1zmfJC_5l4MJrQs8QHUSyKin6Z9RI0LDbUahYXqdnubSwRCEYravFZptXX9EQQiLExzzJP0KcGlJqhHLPjVkHpO71hzx0SaxI89SSm8-naYTC_JdWNp8Y_xL_mKCweNimVOvWcDVIG6fNBndCgYhWWbjn7oh6FaAmO0_N7m7Fu81buq80X7-7DvkGqXw', type: 'tv', year: '2023' },
    { title: 'Nebula Garden', subtitle: 'Romantic Drama', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBybuy_WkV7JYVfTtPKw4m4T9nF8UmNup7PGdvMwooSkWOAINtaePoU2l8CLviM9PKErqyR42dQGChgEVeFqwEC3PySUpLWlzRMZODremwxYN6DeFCyeZUqtdISqdgbXvwlhVOLmuZsKQgdCnO2Ia_VKezO_3AEQT8KiaM1reATh-PB6eGeNHt1W8m75WYcFhm0dQEDP9Xr_MuI2NzzwPDtSLGS7PmEC_se-9Qt6FhNKpekz1UaC5t0X0DBMXPsgtEwiX_Qpw2auQw', type: 'movie', year: '2025' },
    { title: 'Silicon Dreams', subtitle: 'Tech Thriller', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp3iKA3HqhyptIdkhZ8FvyRP13gUDDPP5cugxibxNOULVy3kZiVUmV4Demlg0buY3uFdJmYcpcb2tezHGz2vUkv3vxLkr-G28FprnVzLX0gVzjWdhbgT0GWNB8mIheI90KZDo3x367QDHlihSckVgu97HWoO9mHGqecnBzVNkC0pjNb_GIF-I1z9F5QPuIfkMf9LyyEcKJ8mye7iAOhtjTJd6HAEbBoZfwXcKF5qtDFJijivEaiLaNu87ZJyJGSANvVMsZnuDhyAk', type: 'tv', year: '2024' },
    { title: 'Cyberpunk Visions', subtitle: 'Animated Series', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7MLXd4zuDkLwoK27evNJBe4774nsYbNuUC1FYcfWXKSyFAdOOJXE2oyE6bIhRM4-7q7xroBT9uYBjLY5WH9U_ybGjZaHtPiBj65vttGi2nZNk0J6s7SKEouIH7qj45wG9W7LixGTuSB3jY4Z9SqGwTfMUYaHQJ22bRZRI0ML6O8eOQ-ayGA9wWKZ6GtWB6uZVLAEG5RZdBZrOM2-uvihy7K59M9pjPnOYsFB9UAOMkKIoDl8-eJwtJqFLMrUzZOoeAzAZxWbOeVc', type: 'tv', year: '2025' },
    { title: 'Echoes of Tomorrow', subtitle: 'Mystery Drama', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvLzqjotd2SEcnu9RysUoWy3uwz7Zo2b4Nby5iMgLn1OQTXqK7K0Bovv-c_kftdLK67WN9Q6kSNIeRW9sdeIZ3A9r2Qxr2RL5JpmuGaC6wuTa2ThvcSzKrbh1KiV-HFf4bXv1aNb_b2MNigmA7-fwMZuW2_OuOQ4b_ntu8O5TUx2u4FJI1eKu8FWoMcqvcXBoKdmLEPfCxKOshlbcsj2oAcAwUSAuUy8DE4dTGcAkfSLXkwXS0eiNhFRl8OucTEA4C_caPaGg_qZQ', type: 'movie', year: '2024' },
    { title: 'Ultra 4K Visuals', subtitle: 'Experience cinema at home', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVfS0i6AMamC5hVLF5VOI2cuOcyjLaE6We4yJyIqsdWobsgn8H2WlRuP0iGUbzRkv5E2s2JMti87DKBojydei6aR-OGL7rdsP-pTOcPWfk-IejMGHSdyNslsMhlKoTk_TESAAwTm3SkQ4SHan-mixSQAv0pGE_6CCCOwp5wtqaZzHDGvj1kiEJqHvgvlk0FRVQxKT0MmEsEX2H9IKDrkZYr_zsBGnhjzjHVziutmdGmF_ulftS3LBRlhTVzinSprHFCGdDZMBtHuY', type: 'movie', year: '2025' },
    { title: 'Crimson Tide', subtitle: 'War Drama', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgjmPS_NEFjJoBKAuP_x2zlzVVWJvLwraByw9z_q-_n7oEQk4C9tIAYCFkgMkN87Z6haDybowwb4Vkai5YT5K0EHu5tepBHJyI4j-boadVhNL3vvxMP0cWkBQStVdM9iQefzR9fJ6hrhobwRxMHUM4pfGttFYFkQh8TqLlatEQG6FCHWkL3uQ7MYDoZGvSb8WaXF7vwjqG9qW_KLnkXPk4MPgAI2e05HURyMCNaReFKNua9pOFJ-GvcMMTrCdYrHIef6qbLDo9FnE', type: 'movie', year: '2023' },
  ];

  get results(): SearchResult[] {
    const q = this.query.toLowerCase().trim();
    if (!q) return [];
    return this.allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.year.includes(q),
    );
  }
}
