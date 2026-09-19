import { ScrollView, Text, View } from "react-native";
import { DashboardCard, DashboardCardProps } from "./components/DashboardCard";
import { useState } from "react";
import { DashboardShortcutCard } from "./components/DashboardShortcutCard";

export default function DashboardClinicaScreen() {

    const [name] = useState('Saúde Viva');

    const dashboardCardData: DashboardCardProps[] = [
        { icon: 'calendar', badgeText: 'Hoje', number: 18, text: 'Consultas do dia', color: '#2563eb' },
        { icon: 'person', badgeText: 'Ativos', number: 6, text: 'Médicos ativos', color: '#16a34a' },
        { icon: 'hourglass', badgeText: 'Livres', number: 7, text: 'Horários disponíveis', color: '#8b5cf6' },
        { icon: 'calendar-sharp', badgeText: 'Taxa', number: 72, text: 'Taxa de ocupação', color: '#f59e0b' },
    ];

    return (
        <ScrollView className="mt-6 px-8">
            <Text className="mb-2 text-sm font-semibold text-gray-600">
                Terça feira, 17 de junho
            </Text>
            <Text className="mb-2 text-xl font-semibold">
                Olá, Clínica {name}
            </Text>

            <View className="mt-4 flex-row justify-center gap-5 flex-wrap">
                {
                    dashboardCardData.map(item => (
                        <DashboardCard
                            key={`${item.badgeText}-${item.text}`}
                            icon={item.icon}
                            badgeText={item.badgeText}
                            number={item.number}
                            text={item.text}
                            color={item.color}
                        />
                    ))
                }
            </View>

            <Text className="my-4 text-xl font-semibold">
                Atalhos rápidos
            </Text>

            <DashboardShortcutCard navigationScreen="Médicos" icon="person" title="Médicos e Especialidades" text="Gerenciar equipe médica" color="#16a34a" />
            <DashboardShortcutCard navigationScreen="Agenda" icon="calendar" title="Agenda e Horários" text="Configurar disponibilidade" color="#8b5cf6" />
            <DashboardShortcutCard navigationScreen="Consultas" icon="calendar" title="Consultas agendadas" text="Acompanhar agendamentos" color="#2563eb" />

        </ScrollView>
    );
}

