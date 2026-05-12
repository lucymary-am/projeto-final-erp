import { CommonModule } from "@angular/common";
import {
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from "@angular/core";

type DashboardResumo = {
  vendasMesAtual: number;
  produtosAtivos: number;
  totalClientes: number;
  crescimentoPercentual: number;
};

type DashboardGraficos = {
  vendasPorMes: { labelMes: string; valor: number }[];
  produtosPorCategoria: { categoriaNome: string; quantidade: number }[];
};

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

@Component({
  selector: "app-summary-cards",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./summary-cards.html",
  styleUrl: "./summary-cards.css",
})
export class SummaryCardsComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) loading = true;
  @Input() resumo: DashboardResumo | null = null;
  @Input() graficos: DashboardGraficos | null = null;

  @ViewChild("vendasLineChart") vendasLineCanvas?: ElementRef<HTMLCanvasElement>;

  private chartVendas?: Chart<"line">;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chartVendas?.destroy();
  }

  private renderChart(): void {
    if (!this.viewReady || this.loading || !this.graficos) {
      return;
    }

    const canvas = this.vendasLineCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    const pontos = this.graficos.vendasPorMes ?? [];
    if (pontos.length === 0) {
      this.chartVendas?.destroy();
      this.chartVendas = undefined;
      return;
    }

    this.chartVendas?.destroy();
    const labels = pontos.map((p) => p.labelMes);
    const valores = pontos.map((p) => p.valor);

    this.chartVendas = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Vendas",
            data: valores,
            borderColor: "#2563EB",
            backgroundColor: "rgba(37, 99, 235, 0.15)",
            pointRadius: 0,
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        elements: {
          line: { borderWidth: 2 },
        },
      },
    });
  }

  formatCrescimento(valor: number | undefined): string {
    const v = valor ?? 0;
    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(v);
    const prefix = v > 0 ? "+" : "";
    return `${prefix}${formatted}%`;
  }
}
