import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { getMyClinicProfile } from "../../../services/clinicProfileService";
import { listDoctors } from "../../../services/doctorService";
import { DashboardCard, DashboardCardProps } from "./components/DashboardCard";
import { DashboardShortcutCard } from "./components/DashboardShortcutCard";

const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

function formatToday(date: Date): string {
    return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

export default function DashboardClinicaScreen() {

    const [today, setToday] = useState(() => formatToday(new Date()));
    const [name, setName] = useState<string | null>(null);
    const [activeDoctors, setActiveDoctors] = useState<number | null>(null);

    // As abas permanecem montadas; recarrega ao voltar para o Início.
    useFocusEffect(
        useCallback(() => {
            let isCurrent = true;
            setToday(formatToday(new Date()));

            getMyClinicProfile()
                .then((profile) => isCurrent && setName(profile.name))
                .catch(() => undefined);

            listDoctors()
                .then((doctors) => isCurrent && setActiveDoctors(doctors.filter((doctor) => doctor.active).length))
                .catch(() => undefined);

            return () => {
                isCurrent = false;
            };
        }, []),
    );

    const dashboardCardData: DashboardCardProps[] = [
        { icon: 'calendar', badgeText: 'Hoje', number: 18, text: 'Consultas do dia', color: '#2563eb' },
        { icon: 'person', badgeText: 'Ativos', number: activeDoctors ?? '–', text: 'Médicos ativos', color: '#16a34a' },
        { icon: 'hourglass', badgeText: 'Livres', number: 7, text: 'Horários disponíveis', color: '#8b5cf6' },
        { icon: 'calendar-sharp', badgeText: 'Taxa', number: 72, text: 'Taxa de ocupação', color: '#f59e0b' },
    ];

    return (
        <ScrollView className="mt-6 px-8">
            <Text className="mb-2 text-sm font-semibold text-gray-600">
                {today}
            </Text>
            <Text className="mb-2 text-xl font-semibold">
                {name ? `Olá, ${name}` : 'Olá'}
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

