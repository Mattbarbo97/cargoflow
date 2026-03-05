import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  useWindowDimensions,
  Platform,
  Linking,
  StatusBar,
} from "react-native";

/**
 * CargoFlow — Gestão de frota descomplicada
 * Landing page (web + mobile) usando Expo + React Native Web (App.js)
 *
 * - Logo maior no desktop
 * - Planos com limites de veículos
 * - Pacotes para adicionar veículos + add-ons extras
 * - Comparação, FAQ e Contato
 */

// ====== EDIT THESE LATER ======
const CONTACT_EMAIL = "comercial@cargoflow.com";
const CONTACT_PHONE = "+55 (11) 0000-0000";
// ==============================

const theme = {
  colors: {
    bg: "#070A10",
    bg2: "#0B1020",
    surface: "rgba(255,255,255,0.05)",
    surface2: "rgba(255,255,255,0.08)",
    surface3: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.12)",
    border2: "rgba(255,255,255,0.18)",
    text: "#F4F7FF",
    muted: "rgba(244,247,255,0.74)",
    muted2: "rgba(244,247,255,0.56)",
    primary: "#5B8CFF",
    primary2: "#7C4DFF",
    good: "#2BD576",
    warn: "#FFB020",
    bad: "#FF4D6D",
  },
  r: { sm: 14, md: 18, lg: 22, xl: 28, pill: 999 },
  s: (n) => n * 8,
  max: 1120,
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function openMail(email) {
  Linking.openURL(`mailto:${email}`);
}

function openTel(phone) {
  const normalized = phone.replace(/\s/g, "");
  Linking.openURL(`tel:${normalized}`);
}

function Pill({ children, tone = "default" }) {
  const bg =
    tone === "brand"
      ? "rgba(91,140,255,0.16)"
      : tone === "good"
      ? "rgba(43,213,118,0.14)"
      : tone === "warn"
      ? "rgba(255,176,32,0.14)"
      : tone === "bad"
      ? "rgba(255,77,109,0.14)"
      : theme.colors.surface2;

  return (
    <View
      style={{
        paddingHorizontal: theme.s(1.25),
        paddingVertical: theme.s(0.75),
        borderRadius: theme.r.pill,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: bg,
      }}
    >
      <Text style={{ color: theme.colors.muted, fontSize: 12, fontWeight: "900" }}>{children}</Text>
    </View>
  );
}

function Button({ variant = "primary", children, onPress, style }) {
  const primary = variant === "primary";
  const ghost = variant === "ghost";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingHorizontal: theme.s(2),
          paddingVertical: theme.s(1.25),
          borderRadius: theme.r.pill,
          borderWidth: primary || ghost ? 0 : 1,
          borderColor: theme.colors.border,
          backgroundColor: primary ? theme.colors.primary : ghost ? "transparent" : theme.colors.surface,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
          opacity: pressed ? 0.92 : 1,
          transform: [{ translateY: pressed ? 0 : -1 }],
        },
        style,
      ]}
    >
      <Text style={{ color: primary ? "#071022" : theme.colors.text, fontWeight: "900", fontSize: 14 }}>
        {children}
      </Text>
    </Pressable>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <View style={{ paddingTop: theme.s(6) }}>
      <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "900" }}>{title}</Text>
      {!!subtitle && (
        <Text style={{ color: theme.colors.muted, marginTop: theme.s(1), lineHeight: 22, maxWidth: 860 }}>
          {subtitle}
        </Text>
      )}
      <View style={{ marginTop: theme.s(2.5), gap: theme.s(1.5) }}>{children}</View>
    </View>
  );
}

function Surface({ children, style }) {
  return (
    <View
      style={[
        {
          borderRadius: theme.r.xl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: theme.s(2),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function FeatureCard({ title, desc, tag }) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 240,
        borderRadius: theme.r.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: theme.s(2),
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>{title}</Text>
        {!!tag && <Pill tone="brand">{tag}</Pill>}
      </View>
      <Text style={{ color: theme.colors.muted, lineHeight: 20 }}>{desc}</Text>
    </View>
  );
}

function PlanCard({ name, price, badge, highlight, bullets, cta, onPress, footnote }) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: 280,
        borderRadius: theme.r.xl,
        borderWidth: 1,
        borderColor: highlight ? "rgba(91,140,255,0.55)" : theme.colors.border,
        backgroundColor: highlight ? "rgba(91,140,255,0.10)" : theme.colors.surface,
        padding: theme.s(2),
        gap: theme.s(1.25),
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 18 }}>{name}</Text>
        <Pill tone={highlight ? "brand" : "default"}>{badge}</Pill>
      </View>

      <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 28 }}>{price}</Text>

      <View style={{ gap: 10 }}>
        {bullets.map((it) => (
          <View key={it} style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: highlight ? "rgba(91,140,255,0.90)" : "rgba(255,255,255,0.35)",
                marginTop: 6,
              }}
            />
            <Text style={{ color: theme.colors.muted, lineHeight: 20, flex: 1 }}>{it}</Text>
          </View>
        ))}
      </View>

      {footnote ? <Text style={{ color: theme.colors.muted2, fontSize: 12, lineHeight: 18 }}>{footnote}</Text> : null}

      <View style={{ marginTop: theme.s(1) }}>
        <Button variant={highlight ? "primary" : "outline"} onPress={onPress}>
          {cta}
        </Button>
      </View>
    </View>
  );
}

function CompareRow({ label, values, isHeader }) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: isHeader ? 0 : 1,
        borderTopColor: theme.colors.border,
        paddingVertical: theme.s(1.25),
        gap: theme.s(1),
      }}
    >
      <View style={{ flex: 1.3 }}>
        <Text style={{ color: isHeader ? theme.colors.text : theme.colors.muted, fontWeight: isHeader ? "900" : "800" }}>
          {label}
        </Text>
      </View>
      {values.map((v, idx) => (
        <View key={idx} style={{ flex: 1, alignItems: "flex-start" }}>
          <Text style={{ color: isHeader ? theme.colors.text : theme.colors.muted, fontWeight: isHeader ? "900" : "800" }}>
            {v}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Field({ label, placeholder, value, onChangeText, keyboardType }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: theme.colors.muted, fontWeight: "900", fontSize: 12 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(244,247,255,0.40)"
        keyboardType={keyboardType}
        style={{
          borderRadius: theme.r.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: "rgba(255,255,255,0.04)",
          paddingHorizontal: theme.s(1.5),
          paddingVertical: theme.s(1.25),
          color: theme.colors.text,
          outlineStyle: "none",
        }}
      />
    </View>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 980;
  const isXL = width >= 1200;

  const headline = clamp(Math.round(width * 0.045), 28, 48);
  const subLead = clamp(Math.round(width * 0.018), 14, 18);

  // Logo larger on desktop
  const LOGO_BOX = isWide ? 62 : 48;
  const LOGO_INNER = isWide ? 54 : 40;

  const logoSource = useMemo(() => {
    try {
      return require("./assets/logo.png");
    } catch (e) {
      return null;
    }
  }, []);

  // Smooth scroll for web (offsets aproximados; funciona bem)
  const scrollToY = (y) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  const approx = { produto: 820, como: 1500, planos: 2200, pacotes: 3050, comparacao: 3650, faq: 4250, contato: 4850 };

  // Form (modelo)
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [mensagem, setMensagem] = useState("");

  const onSubmit = () => {
    if (Platform.OS === "web") {
      alert("Pedido enviado (modelo). Depois conectamos com WhatsApp/CRM/webhook.");
    } else {
      openMail(CONTACT_EMAIL);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: theme.s(7), backgroundColor: theme.colors.bg }}>
        {/* Top Bar */}
        <View
          style={{
            paddingHorizontal: theme.s(2),
            paddingTop: theme.s(2),
            paddingBottom: theme.s(2),
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            backgroundColor: "rgba(7,10,16,0.78)",
          }}
        >
          <View
            style={{
              maxWidth: theme.max,
              width: "100%",
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: theme.s(2),
            }}
          >
            {/* Brand */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.s(1.25) }}>
              <View
                style={{
                  width: LOGO_BOX,
                  height: LOGO_BOX,
                  borderRadius: isWide ? 22 : 16,
                  padding: 2,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  backgroundColor: "rgba(91,140,255,0.14)",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    borderRadius: isWide ? 20 : 14,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {logoSource ? (
                    <Image source={logoSource} style={{ width: LOGO_INNER, height: LOGO_INNER }} resizeMode="contain" />
                  ) : (
                    <Text style={{ color: theme.colors.text, fontWeight: "900" }}>CF</Text>
                  )}
                </View>
              </View>

              <View>
                <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>CargoFlow</Text>
                <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Gestão de frota descomplicada</Text>
              </View>
            </View>

            {/* Nav */}
            {isWide ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <Pressable onPress={() => scrollToY(approx.produto)}>
                  <Text style={{ color: theme.colors.muted, fontWeight: "900" }}>Produto</Text>
                </Pressable>
                <Pressable onPress={() => scrollToY(approx.como)}>
                  <Text style={{ color: theme.colors.muted, fontWeight: "900" }}>Como funciona</Text>
                </Pressable>
                <Pressable onPress={() => scrollToY(approx.planos)}>
                  <Text style={{ color: theme.colors.muted, fontWeight: "900" }}>Planos</Text>
                </Pressable>
                <Pressable onPress={() => scrollToY(approx.contato)}>
                  <Text style={{ color: theme.colors.muted, fontWeight: "900" }}>Contato</Text>
                </Pressable>
              </View>
            ) : (
              <View />
            )}

            {/* Actions */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {isWide ? (
                <Button variant="outline" onPress={() => scrollToY(approx.contato)}>
                  Falar com vendas
                </Button>
              ) : null}
              <Button onPress={() => scrollToY(approx.planos)}>Ver preços</Button>
            </View>
          </View>
        </View>

        {/* Content container */}
        <View style={{ paddingHorizontal: theme.s(2), paddingTop: theme.s(5) }}>
          <View style={{ maxWidth: theme.max, width: "100%", alignSelf: "center" }}>
            {/* HERO */}
            <View style={{ flexDirection: isWide ? "row" : "column", alignItems: isWide ? "center" : "stretch", gap: theme.s(3) }}>
              {/* Left */}
              <View style={{ flex: 1, gap: theme.s(2) }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1) }}>
                  <Pill tone="brand">Autônomo: R$ 39,90/mês</Pill>
                  <Pill>Frete + custos</Pill>
                  <Pill>Relatório simples</Pill>
                  <Pill tone="brand">1 veículo incluso</Pill>
                </View>

                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: headline,
                    fontWeight: "900",
                    lineHeight: Math.round(headline * 1.12),
                    letterSpacing: -0.4,
                  }}
                >
                  Gestão de frota descomplicada para controlar custos e precificar fretes.
                </Text>

                <Text style={{ color: theme.colors.muted, fontSize: subLead, lineHeight: 24, maxWidth: 760 }}>
                  Registre abastecimentos e manutenções, calcule e registre fretes e tenha relatórios simples.
                  Quando precisar de BI e visão gerencial, evolua para o plano Empresa.
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1.25) }}>
                  <Button onPress={() => scrollToY(approx.planos)}>Ver planos</Button>
                  <Button variant="outline" onPress={() => scrollToY(approx.contato)}>
                    Pedir demo
                  </Button>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1), marginTop: theme.s(1) }}>
                  <Pill tone="good">Sem planilhas</Pill>
                  <Pill>Sem BI no Autônomo</Pill>
                  <Pill tone="brand">BI no Empresa+</Pill>
                  <Pill>Pacotes de veículos</Pill>
                </View>
              </View>

              {/* Right - Preview */}
              <Surface style={{ flex: 1, gap: theme.s(1.25), backgroundColor: "rgba(255,255,255,0.05)" }}>
                <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 18 }}>O que você faz no CargoFlow</Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1) }}>
                  <Pill>Abastecimentos</Pill>
                  <Pill>Manutenção</Pill>
                  <Pill>Frete (cálculo)</Pill>
                  <Pill>Frete (registro)</Pill>
                  <Pill>Relatório</Pill>
                </View>

                <View style={{ gap: theme.s(1) }}>
                  <FeatureCard
                    title="Abastecimentos"
                    tag="Autônomo"
                    desc="Registre litros, valor, odômetro e posto. Tenha consumo e custo no relatório simples."
                  />
                  <FeatureCard
                    title="Manutenção"
                    tag="Autônomo"
                    desc="Lançamentos por categoria (pneu/óleo/elétrica etc.) para entender seu custo real."
                  />
                  <FeatureCard
                    title="BI e dashboards"
                    tag="Empresa+"
                    desc="Dashboards, filtros e visão gerencial entram a partir do Starter Empresa."
                  />
                </View>
              </Surface>
            </View>

            {/* PRODUTO */}
            <Section
              title="Produto"
              subtitle="Comece enxuto (Autônomo) e evolua para análise e gestão (Empresa/Pro) quando sua frota crescer."
            >
              <View style={{ flexDirection: isWide ? "row" : "column", gap: theme.s(1.5), flexWrap: "wrap" }}>
                <FeatureCard
                  title="Controle de custos"
                  tag="Abastecimento + manutenção"
                  desc="Organize lançamentos por período para saber quanto custa rodar e evitar surpresas."
                />
                <FeatureCard
                  title="Precificação de frete"
                  tag="Cálculo + registro"
                  desc="Calcule com custos e margem, salve cotação e registre fretes fechados para histórico."
                />
                <FeatureCard
                  title="Gestão por veículo"
                  tag="Limites e pacotes"
                  desc="Cada plano inclui um número de veículos. Adicione pacotes conforme sua frota aumenta."
                />
              </View>

              <Surface style={{ backgroundColor: "rgba(255,255,255,0.04)", gap: 10 }}>
                <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 18 }}>Precisa de BI e visão gerencial?</Text>
                <Text style={{ color: theme.colors.muted, lineHeight: 22 }}>
                  Dashboards, filtros avançados e métricas entram no <Text style={{ fontWeight: "900" }}>Starter Empresa</Text> e acima.
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1) }}>
                  <Button onPress={() => scrollToY(approx.planos)}>Ver planos</Button>
                  <Button variant="outline" onPress={() => scrollToY(approx.contato)}>
                    Falar com vendas
                  </Button>
                </View>
              </Surface>
            </Section>

            {/* COMO FUNCIONA */}
            <Section title="Como funciona" subtitle="Fluxo simples para controle do dia a dia e evolução para gestão quando precisar.">
              <View style={{ flexDirection: isWide ? "row" : "column", gap: theme.s(1.5) }}>
                {[
                  ["01", "Registre o dia a dia", "Abastecimentos e manutenções com categorias, odômetro e histórico."],
                  ["02", "Calcule e feche fretes", "Cálculo com custos/margem e registro do frete para acompanhamento."],
                  ["03", "Relate e evolua", "Relatório simples no Autônomo. BI e dashboards a partir do Empresa."],
                ].map(([n, t, d]) => (
                  <Surface key={n} style={{ flex: 1, gap: 8, backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>{t}</Text>
                      <Pill>{n}</Pill>
                    </View>
                    <Text style={{ color: theme.colors.muted, lineHeight: 20 }}>{d}</Text>
                  </Surface>
                ))}
              </View>
            </Section>

            {/* PLANOS */}
            <Section title="Planos" subtitle="Acessível para começar e escalável para crescer. Escopo claro por plano, com limites de veículos.">
              <View style={{ flexDirection: isWide ? "row" : "column", gap: theme.s(1.5), flexWrap: "wrap" }}>
                <PlanCard
                  name="Starter Autônomo"
                  price="R$ 39,90/mês"
                  badge="Para começar"
                  highlight={false}
                  bullets={[
                    "✅ 1 veículo incluído (pacotes para adicionar mais)",
                    "✅ 1 usuário",
                    "✅ Abastecimentos + despesas de manutenção",
                    "✅ Cálculo e registro de frete",
                    "✅ Relatório simples por período",
                    "🚫 Sem BI / dashboards avançados",
                  ]}
                  footnote="Ideal para autônomo/MEI que quer controle e precificação."
                  cta="Começar"
                  onPress={() => scrollToY(approx.contato)}
                />

                <PlanCard
                  name="Starter Empresa"
                  price="A partir de R$ 99/mês"
                  badge="Com BI"
                  highlight={true}
                  bullets={[
                    "✅ Até 5 veículos incluídos (pacotes para adicionar mais)",
                    "✅ Até 3 usuários",
                    "✅ Tudo do Autônomo",
                    "✅ BI/Dashboards e filtros avançados",
                    "✅ Relatórios e exportações melhores",
                  ]}
                  footnote="Ideal para pequenas empresas que precisam de gestão e análise."
                  cta="Falar com vendas"
                  onPress={() => scrollToY(approx.contato)}
                />
              </View>

              <View style={{ flexDirection: isWide ? "row" : "column", gap: theme.s(1.5), flexWrap: "wrap" }}>
                <PlanCard
                  name="Pro / Scale"
                  price="R$ 299–599/mês"
                  badge="Para crescer"
                  highlight={false}
                  bullets={[
                    "✅ Até 25 veículos incluídos",
                    "✅ BI completo + dashboards por visão",
                    "✅ Alertas/automação (SLA/pendências)",
                    "✅ Integrações via API/webhooks (1+)",
                    "✅ Suporte priorizado",
                  ]}
                  footnote="Para operações que precisam de performance e automação."
                  cta="Quero o Pro"
                  onPress={() => scrollToY(approx.contato)}
                />

                <PlanCard
                  name="Enterprise"
                  price="R$ 1.500+/mês"
                  badge="Corporativo"
                  highlight={false}
                  bullets={[
                    "✅ Veículos e usuários sob medida",
                    "✅ SSO e permissões avançadas",
                    "✅ SLA contratual e governança",
                    "✅ Ambientes dedicados (opcional)",
                    "✅ Integrações e dados sob medida",
                  ]}
                  footnote="Para operações grandes e requisitos de segurança/compliance."
                  cta="Falar com vendas"
                  onPress={() => scrollToY(approx.contato)}
                />
              </View>
            </Section>

            {/* PACOTES E EXTRAS */}
            <Section
              title="Pacotes e extras"
              subtitle="Adicione veículos e libere funcionalidades conforme sua necessidade — sem precisar trocar de plano."
            >
              <View style={{ flexDirection: isWide ? "row" : "column", gap: theme.s(1.5), flexWrap: "wrap" }}>
                <Surface style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", gap: 10 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>Pacotes de veículos</Text>
                  <Text style={{ color: theme.colors.muted, lineHeight: 20 }}>
                    Comece com 1 veículo no Autônomo e adicione conforme cresce.
                  </Text>

                  <View style={{ gap: 8 }}>
                    <Text style={{ color: theme.colors.muted }}>
                      • +1 veículo: <Text style={{ color: theme.colors.text, fontWeight: "900" }}>R$ 9,90/mês</Text>
                    </Text>
                    <Text style={{ color: theme.colors.muted }}>
                      • +5 veículos: <Text style={{ color: theme.colors.text, fontWeight: "900" }}>R$ 39,90/mês</Text>
                    </Text>
                    <Text style={{ color: theme.colors.muted }}>
                      • Empresa: +5 veículos <Text style={{ color: theme.colors.text, fontWeight: "900" }}>R$ 49/mês</Text>{" "}
                      • +20 veículos <Text style={{ color: theme.colors.text, fontWeight: "900" }}>R$ 149/mês</Text>
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1), marginTop: 4 }}>
                    <Pill tone="brand">Escalável</Pill>
                    <Pill>Sem travar o crescimento</Pill>
                  </View>
                </Surface>

                <Surface style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", gap: 10 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>Funcionalidades extras</Text>
                  <Text style={{ color: theme.colors.muted, lineHeight: 20 }}>
                    Adicione módulos conforme sua operação precisa.
                  </Text>

                  <View style={{ gap: 8 }}>
                    <Text style={{ color: theme.colors.muted }}>
                      • Exportação avançada (PDF/relatórios):{" "}
                      <Text style={{ color: theme.colors.text, fontWeight: "900" }}>R$ 19,90/mês</Text>
                    </Text>
                    <Text style={{ color: theme.colors.muted }}>
                      • Anexos (500/mês): <Text style={{ color: theme.colors.text, fontWeight: "900" }}>R$ 14,90/mês</Text>
                    </Text>
                    <Text style={{ color: theme.colors.muted }}>
                      • Usuário extra (Empresa+): <Text style={{ color: theme.colors.text, fontWeight: "900" }}>R$ 9,90/mês</Text>
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1), marginTop: 4 }}>
                    <Pill tone="good">Personalizável</Pill>
                    <Pill>Upsell natural</Pill>
                  </View>
                </Surface>
              </View>

              <Surface style={{ backgroundColor: "rgba(255,255,255,0.04)", gap: 10 }}>
                <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Transparente e escalável</Text>
                <Text style={{ color: theme.colors.muted, lineHeight: 22 }}>
                  Você começa acessível e só paga mais quando sua frota e suas necessidades crescem.
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1) }}>
                  <Pill tone="good">Sem pegadinhas</Pill>
                  <Pill tone="brand">Cresce com você</Pill>
                  <Pill>Controle do orçamento</Pill>
                </View>
              </Surface>
            </Section>

            {/* COMPARAÇÃO */}
            <Section title="Comparação rápida" subtitle="Uma visão direta do que entra em cada plano.">
              <Surface style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                <CompareRow isHeader label="Recurso" values={["Autônomo", "Empresa", "Pro/Scale", "Enterprise"]} />
                <CompareRow label="Veículos incluídos" values={["1 (+pacotes)", "5 (+pacotes)", "25", "custom"]} />
                <CompareRow label="Usuários" values={["1", "até 3", "10–20", "custom"]} />
                <CompareRow label="Abastecimentos" values={["✓", "✓", "✓", "✓"]} />
                <CompareRow label="Manutenção" values={["✓", "✓", "✓", "✓"]} />
                <CompareRow label="Cálculo de frete" values={["✓", "✓", "✓", "✓"]} />
                <CompareRow label="Registro de frete" values={["✓", "✓", "✓", "✓"]} />
                <CompareRow label="Relatório simples" values={["✓", "✓", "✓", "✓"]} />
                <CompareRow label="BI / Dashboards" values={["—", "✓", "✓✓", "✓✓"]} />
                <CompareRow label="Filtros avançados" values={["—", "✓", "✓✓", "✓✓"]} />
                <CompareRow label="Integrações (API/webhook)" values={["—", "opcional", "inclui", "custom"]} />
                <CompareRow label="Suporte" values={["padrão", "padrão", "priorizado", "dedicado"]} />
              </Surface>
            </Section>

            {/* FAQ */}
            <Section title="FAQ" subtitle="Respostas rápidas para acelerar sua decisão.">
              <View style={{ flexDirection: isXL ? "row" : "column", gap: theme.s(1.5) }}>
                {[
                  {
                    q: "Posso ter mais de 1 veículo no Autônomo?",
                    a: "Sim. O plano inclui 1 veículo e você pode comprar pacotes para adicionar veículos conforme a sua frota cresce.",
                  },
                  {
                    q: "O Autônomo tem BI?",
                    a: "Não. Ele é enxuto (custos + frete + relatório simples). BI entra a partir do Starter Empresa.",
                  },
                  {
                    q: "Posso comprar funcionalidades extras?",
                    a: "Sim. Dá para adicionar pacotes (ex.: exportação avançada, anexos e usuário extra) sem precisar trocar de plano.",
                  },
                ].map((f) => (
                  <Surface key={f.q} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", gap: 8 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: "900" }}>{f.q}</Text>
                    <Text style={{ color: theme.colors.muted, lineHeight: 20 }}>{f.a}</Text>
                  </Surface>
                ))}
              </View>
            </Section>

            {/* CONTATO */}
            <Section
              title="Contato"
              subtitle="Deixe seus dados para demo, ou fale direto por e-mail/telefone. Depois troco os contatos."
            >
              <View style={{ flexDirection: isWide ? "row" : "column", gap: theme.s(1.5) }}>
                <Surface style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.05)", gap: theme.s(1.5) }}>
                  <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 18 }}>Pedir demo / falar com vendas</Text>

                  <Field
                    label="E-mail"
                    placeholder="voce@empresa.com"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <Field
                    label="Empresa"
                    placeholder="Nome da empresa (opcional)"
                    value={empresa}
                    onChangeText={setEmpresa}
                  />
                  <Field
                    label="Mensagem"
                    placeholder="Ex.: Quero Autônomo com +5 veículos / Quero BI no Empresa"
                    value={mensagem}
                    onChangeText={setMensagem}
                  />

                  <Button onPress={onSubmit}>Enviar</Button>

                  <Text style={{ color: theme.colors.muted2, fontSize: 12, lineHeight: 18 }}>
                    * Formulário modelo. Conecte em um webhook/CRM quando estiver pronto.
                  </Text>
                </Surface>

                <View style={{ flex: 1, gap: theme.s(1.5) }}>
                  <Surface style={{ backgroundColor: "rgba(255,255,255,0.05)", gap: 10 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 18 }}>Contato direto</Text>
                    <Text style={{ color: theme.colors.muted }}>{CONTACT_EMAIL}</Text>
                    <Text style={{ color: theme.colors.muted }}>{CONTACT_PHONE}</Text>

                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1) }}>
                      <Button variant="outline" onPress={() => openMail(CONTACT_EMAIL)} style={{ paddingHorizontal: theme.s(1.5) }}>
                        Enviar e-mail
                      </Button>
                      <Button variant="outline" onPress={() => openTel(CONTACT_PHONE)} style={{ paddingHorizontal: theme.s(1.5) }}>
                        Ligar
                      </Button>
                    </View>
                  </Surface>

                  <Surface style={{ backgroundColor: "rgba(255,255,255,0.04)", gap: 8 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: "900" }}>Pronto para vender</Text>
                    <Text style={{ color: theme.colors.muted, lineHeight: 22 }}>
                      Autônomo com preço acessível (R$ 39,90) e crescimento via pacotes de veículos e add-ons. BI como upgrade no Empresa+.
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.s(1) }}>
                      <Pill tone="good">Acessível</Pill>
                      <Pill tone="brand">Escalável</Pill>
                      <Pill>Monetização por módulos</Pill>
                    </View>
                  </Surface>
                </View>
              </View>
            </Section>

            {/* Footer */}
            <View
              style={{
                marginTop: theme.s(7),
                paddingTop: theme.s(3),
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
              }}
            >
              <View style={{ flexDirection: isWide ? "row" : "column", gap: theme.s(2), justifyContent: "space-between" }}>
                <View style={{ gap: 6, maxWidth: 680 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>
                    CargoFlow — Gestão de frota descomplicada
                  </Text>
                  <Text style={{ color: theme.colors.muted, lineHeight: 22 }}>
                    Controle de custos e frete para autônomos — e BI para empresas que precisam de visão gerencial.
                  </Text>
                </View>
                <View style={{ gap: 6 }}>
                  <Text style={{ color: theme.colors.text, fontWeight: "900", fontSize: 16 }}>Planos</Text>
                  <Text style={{ color: theme.colors.muted }}>Autônomo: R$ 39,90/mês (1 veículo + pacotes)</Text>
                  <Text style={{ color: theme.colors.muted }}>Empresa: a partir de R$ 99/mês (5 veículos + BI)</Text>
                  <Text style={{ color: theme.colors.muted }}>Pro/Scale e Enterprise: sob medida</Text>
                </View>
              </View>

              <Text style={{ color: theme.colors.muted2, marginTop: theme.s(3), fontSize: 12 }}>
                © {new Date().getFullYear()} CargoFlow. Todos os direitos reservados.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}