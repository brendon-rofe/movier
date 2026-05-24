import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

interface ContinueWatchingItem {
  title: string;
  subtitle: string;
  progress: number;
  image: string;
}

interface CategoryItem {
  title: string;
  subtitle?: string;
  tag?: string;
  type: 'large' | 'medium' | 'wide';
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, RouterLink],
})
export class HomePage {
  heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhyXIPEueFHsrDkiJKbjJzKa3rNGFExCtdSABuEO6oAb2Ud2fnIclYfibd2cBxlJcNdPln5Jqtet3ujim3sogN6FCoEBtWpkNyc0p5LXjXPPiv4KjWU6bg87F-nfc8P28JvHennPjb68U8OwiCkYGBiNpcio3yeBW1sQLYsqIye1v-qdb_cd51vWdL9002IEHTHZnjkIzn9_ARIrOAsrZzG5cgcNIW4E4DyIfYYF3h1tN04su-ITUM9tkPuzNMcK9KMrPAsblonIQ';
  profileImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4YV5ni1aKb4BqdMdcucLHbKZy_ZYbTt67rWT2Cc_BdCRMUn-sbw1t_FWDrR4q6H87ir5CwIu-FZ4-htLBswHRwwwLphQJo4vIReCmkNAP_qgX56_M9otTW7uga_mub84fDbDQcBj7ULcdYenGX4aj9frRDfS3uid7p3St1FsozDHLpdGnfkkcYXUfKTfy8UjYBruezKaEuh7sLIQU5_iIGW4Z89YdYRTIWsZwuAfHfccJABnC8kIICwnjxXkgCPWC_8jUpZaNb-M';

  trendingMovie = {
    title: 'Interstellar Odyssey',
    description: 'Beyond the horizons of the known universe, one crew risks everything to save humanity from its final sunset.',
    genres: ['SCI-FI', 'DRAMA'],
  };

  continueWatching: ContinueWatchingItem[] = [
    {
      title: 'The Midnight Rain',
      subtitle: 'S1 : E4 \u2022 24m remaining',
      progress: 65,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU0VWurJKXuz_2WpMZqhVA_T9nDecLwMuFKGQ_TnlfgLoxHpSNoXfxB8v4uWjTacJtpHYw8mz0fhxdiSCY4xwTAf5hl_rYutwJRIAeWsQ377Qowuu3ArfSVemu9e7jnG4yzOaJEwyV6sgSmn7lNiE4pHix7EYOL1zOkta6FJiGk5JaQyOl2GLG3zWaXhHUTwvWycYfrt8_ioEDvu-bJou13WNuA_KJ__NHCK8YWUoNmTRIubSC1xpXZ7jQ8Hwhfv6pbwZkrFrPDEc',
    },
    {
      title: 'Digital Horizons',
      subtitle: 'Movie \u2022 1h 12m remaining',
      progress: 30,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgfOmKsb3WI6nIYzP6zgQdYmAvbYK54XW--i309ShIMKYCMiAJxQD5bLVsTu5Pxqj8R6vXxEsEWVXs_J-iDEqW5n06NJBn9pJe8CvyrTLaqC7WfO395GlbnUWMXap8ScUL-JbMdet2x4284XAHjYCp2JoV00k3klAq8Zrsy_2WkNIbHsENheKQaCuYu0JNl4AUUiFikHdddhSmnuTr_Zva8aHAUKNc8sxfVvWrb-fi4sG4dI2qoXuwXGioxgZ_dAWLTiN-24RQqOw',
    },
  ];

  categories: CategoryItem[] = [
    {
      title: 'Cyberpunk Visions', subtitle: '12 Movies \u2022 4 Series',
      tag: 'CURATED COLLECTION', type: 'large',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7MLXd4zuDkLwoK27evNJBe4774nsYbNuUC1FYcfWXKSyFAdOOJXE2oyE6bIhRM4-7q7xroBT9uYBjLY5WH9U_ybGjZaHtPiBj65vttGi2nZNk0J6s7SKEouIH7qj45wG9W7LixGTuSB3jY4Z9SqGwTfMUYaHQJ22bRZRI0ML6O8eOQ-ayGA9wWKZ6GtWB6uZVLAEG5RZdBZrOM2-uvihy7K59M9pjPnOYsFB9UAOMkKIoDl8-eJwtJqFLMrUzZOoeAzAZxWbOeVc',
    },
    {
      title: 'Action', type: 'medium',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgjmPS_NEFjJoBKAuP_x2zlzVVWJvLwraByw9z_q-_n7oEQk4C9tIAYCFkgMkN87Z6haDybowwb4Vkai5YT5K0EHu5tepBHJyI4j-boadVhNL3vvxMP0cWkBQStVdM9iQefzR9fJ6hrhobwRxMHUM4pfGttFYFkQh8TqLlatEQG6FCHWkL3uQ7MYDoZGvSb8WaXF7vwjqG9qW_KLnkXPk4MPgAI2e05HURyMCNaReFKNua9pOFJ-GvcMMTrCdYrHIef6qbLDo9FnE',
    },
    {
      title: 'Mystery', type: 'medium',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvLzqjotd2SEcnu9RysUoWy3uwz7Zo2b4Nby5iMgLn1OQTXqK7K0Bovv-c_kftdLK67WN9Q6kSNIeRW9sdeIZ3A9r2Qxr2RL5JpmuGaC6wuTa2ThvcSzKrbh1KiV-HFf4bXv1aNb_b2MNigmA7-fwMZuW2_OuOQ4b_ntu8O5TUx2u4FJI1eKu8FWoMcqvcXBoKdmLEPfCxKOshlbcsj2oAcAwUSAuUy8DE4dTGcAkfSLXkwXS0eiNhFRl8OucTEA4C_caPaGg_qZQ',
    },
    {
      title: 'Ultra 4K Visuals', subtitle: 'Experience cinema at home', type: 'wide',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVfS0i6AMamC5hVLF5VOI2cuOcyjLaE6We4yJyIqsdWobsgn8H2WlRuP0iGUbzRkv5E2s2JMti87DKBojydei6aR-OGL7rdsP-pTOcPWfk-IejMGHSdyNslsMhlKoTk_TESAAwTm3SkQ4SHan-mixSQAv0pGE_6CCCOwp5wtqaZzHDGvj1kiEJqHvgvlk0FRVQxKT0MmEsEX2H9IKDrkZYr_zsBGnhjzjHVziutmdGmF_ulftS3LBRlhTVzinSprHFCGdDZMBtHuY',
    },
  ];
}
