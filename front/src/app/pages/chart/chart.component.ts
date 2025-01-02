import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { LocalstorageService } from '../../services/localstorage.service';
import frApexChart from 'apexcharts/dist/locales/fr.json';
import enApexChart from 'apexcharts/dist/locales/en.json';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    TranslateModule,
    NgApexchartsModule
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {

  localStorageService = inject(LocalstorageService);
  translate = inject(TranslateService);

  apexChart: ApexChart = {
    height: 450,
    width: '100%',
    type: 'area',
    stacked: false,
    locales: [frApexChart, enApexChart],
    defaultLocale: this.translate.currentLang ?? 'en',
  }

  apexSeries: ApexAxisChartSeries = [
    {
      name: 'Temperature',
      data: [],
      color: '#d8392b'
    }
  ];

  apexXAxis: ApexXAxis = {
    type: 'datetime',
    tickPlacement: 'between',
    categories: [],
  }

  apexMarkers: ApexMarkers = {
    size: 4,
    strokeWidth: 0,
    hover: {
      size: 4
    }
  }

  apexLegend: ApexLegend = {
    position: 'top'
  }

  apexFill: ApexFill = {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100]
    }
  }

  apexTitle: ApexTitleSubtitle = {
    text: 'Temperature (°C)',
    align: 'center',
    style: {
      fontFamily: 'inherit, sans-serif',
    }
  }

  apexSubtitle: ApexTitleSubtitle = {
    text: '',
    align: 'center',
    style: {
      fontFamily: 'inherit, sans-serif',
    }
  }

  apexGrid: ApexGrid = {
    xaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      right: 50
    }
  }

  apexDataLabel: ApexDataLabels = {
    enabled: true,
  }

  apexStroke: ApexStroke = {
    width: 3,
  }


  ngOnInit(): void {

    this.setUpChartData();
    this.setUpChartSubtitle();

  }


  /**
   * Set up the chart data
   */
  setUpChartData() {
    // Get the measures from the local storage
    const picturesList = this.localStorageService.getMeasuresFromLocalStorage();

    // Order the pictures by measure date
    picturesList.sort((a: any, b: any) => new Date(a.measureDate).getTime() - new Date(b.measureDate).getTime());

    // Fill the series and x-axis data
    picturesList.forEach((picture: any) => {
      const temp: any = picture.temperature ? Math.round(picture.temperature * 10) / 10 : null;
      this.apexSeries[0].data.push(temp);
      this.apexXAxis.categories.push(new Date(picture.measureDate).getTime());
    });
  }


  /**
   * Set up the chart title which contains the profile infos
   */
  setUpChartSubtitle() {
    // Get the profile from local storage to set the subtitle (child name and age)
    const profile = this.localStorageService.getParentChildProfileFromLocalStorage();
    const yearsOld = this.translate.instant('years-old');
    const parent = this.translate.instant('parent');
    const contact = this.translate.instant('contact');
    const note = this.translate.instant('note');
    let subtitleInfos = [];
    if (profile.childName) {
      subtitleInfos.push(profile.childName);
    }
    if (profile.childAge) {
      subtitleInfos.push(profile.childAge + ' ' + yearsOld);
    }

    if (profile.parentName) {
      subtitleInfos.push(`${parent}: ${profile.parentName}`);
    }

    if (profile.parentContact) {
      subtitleInfos.push(`${contact}: ${profile.parentContact}`);
    }

    if (profile.childMedicalCondition) {
      subtitleInfos.push(` ${note}: ${profile.childMedicalCondition}`);
    }

    this.apexSubtitle.text = subtitleInfos.join(' - ');
  }


}
