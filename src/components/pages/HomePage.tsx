'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { features, machineGuides, workoutPrograms, foodDatabase } from '@/lib/data';
import type { FoodItem } from '@/lib/data';
import {
  Bot, Dumbbell, BarChart3, Apple, Users, MapPin,
  ArrowRight, Zap, Shield, Flame, Target, TrendingUp,
  ChevronRight, ChevronDown, ChevronLeft, ChevronUp, Clock, Calendar, Cpu,
  AlertTriangle, Lightbulb, Settings, ListOrdered,
  Search, Plus, Minus, Trash2, Utensils, Beef, Salad, Droplets, Cookie, Milk,
  X,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  bot: <Bot className="h-6 w-6" />,
  dumbbell: <Dumbbell className="h-6 w-6" />,
  chart: <BarChart3 className="h-6 w-6" />,
  apple: <Apple className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  'map-pin': <MapPin className="h-6 w-6" />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const difficultyColor: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const levelColor: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const levelGradient: Record<string, string> = {
  beginner: 'from-green-500/20 via-emerald-500/10 to-transparent',
  intermediate: 'from-yellow-500/20 via-amber-500/10 to-transparent',
  advanced: 'from-red-500/20 via-rose-500/10 to-transparent',
};

const levelBorder: Record<string, string> = {
  beginner: 'border-green-500/30 hover:border-green-500/50',
  intermediate: 'border-yellow-500/30 hover:border-yellow-500/50',
  advanced: 'border-red-500/30 hover:border-red-500/50',
};

const programEmojis: Record<string, string> = {
  'Full Body Foundation': '💪',
  'Push / Pull / Legs': '⚡',
  'HIIT Fat Burn': '🔥',
  'Strength Builder': '🏋️',
  'Upper / Lower Split': '🎯',
  'Muscle Hypertrophy': '🦾',
};

const machineIcons: Record<string, string> = {
  Treadmill: '🏃',
  'Leg Press Machine': '🦵',
  'Cable Crossover Machine': '🔗',
  'Lat Pulldown Machine': '⬇️',
  'Chest Press Machine': '💪',
  'Smith Machine': '🏋️',
};

const foodCategoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  all: { label: 'All', icon: <Utensils className="h-4 w-4" />, color: 'bg-primary/10 text-primary' },
  protein: { label: 'Protein', icon: <Beef className="h-4 w-4" />, color: 'bg-red-500/10 text-red-400' },
  carbs: { label: 'Carbs', icon: <Salad className="h-4 w-4" />, color: 'bg-amber-500/10 text-amber-400' },
  fruits: { label: 'Fruits', icon: <Apple className="h-4 w-4" />, color: 'bg-green-500/10 text-green-400' },
  vegetables: { label: 'Veggies', icon: <Salad className="h-4 w-4" />, color: 'bg-emerald-500/10 text-emerald-400' },
  dairy: { label: 'Dairy', icon: <Milk className="h-4 w-4" />, color: 'bg-sky-500/10 text-sky-400' },
  fats: { label: 'Fats', icon: <Droplets className="h-4 w-4" />, color: 'bg-yellow-500/10 text-yellow-400' },
  beverages: { label: 'Drinks', icon: <Droplets className="h-4 w-4" />, color: 'bg-purple-500/10 text-purple-400' },
  snacks: { label: 'Snacks', icon: <Cookie className="h-4 w-4" />, color: 'bg-orange-500/10 text-orange-400' },
};

interface PlateItem {
  food: FoodItem;
  servings: number;
}

export function HomePage() {
  const { navigate } = useAppStore();
  const [selectedMachine, setSelectedMachine] = useState<string>(machineGuides[0].id);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('steps');
  const scrollRef = useRef<HTMLDivElement>(null);
  const programScrollRef = useRef<HTMLDivElement>(null);

  const activeMachine = machineGuides.find(m => m.id === selectedMachine);
  const activeProgram = workoutPrograms.find(p => p.id === selectedProgram);
  const machineIndex = machineGuides.findIndex(m => m.id === selectedMachine);

  // Food calculator state
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategory, setFoodCategory] = useState('all');
  const [myPlate, setMyPlate] = useState<PlateItem[]>([]);
  const [showMyPlate, setShowMyPlate] = useState(false);

  const filteredFoods = useMemo(() => {
    return foodDatabase.filter(f => {
      const matchCategory = foodCategory === 'all' || f.category === foodCategory;
      const matchSearch = foodSearch === '' || f.name.toLowerCase().includes(foodSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [foodSearch, foodCategory]);

  const plateTotals = useMemo(() => {
    return myPlate.reduce(
      (acc, item) => ({
        calories: acc.calories + Math.round(item.food.calories * item.servings),
        protein: Math.round((acc.protein + item.food.protein * item.servings) * 10) / 10,
        carbs: Math.round((acc.carbs + item.food.carbs * item.servings) * 10) / 10,
        fat: Math.round((acc.fat + item.food.fat * item.servings) * 10) / 10,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [myPlate]);

  const macroPercent = useMemo(() => {
    const total = plateTotals.protein * 4 + plateTotals.carbs * 4 + plateTotals.fat * 9;
    if (total === 0) return { protein: 0, carbs: 0, fat: 0 };
    return {
      protein: Math.round((plateTotals.protein * 4) / total * 100),
      carbs: Math.round((plateTotals.carbs * 4) / total * 100),
      fat: Math.round((plateTotals.fat * 9) / total * 100),
    };
  }, [plateTotals]);

  const addToPlate = (food: FoodItem) => {
    setMyPlate(prev => {
      const existing = prev.find(p => p.food.id === food.id);
      if (existing) {
        return prev.map(p => p.food.id === food.id ? { ...p, servings: p.servings + 1 } : p);
      }
      return [...prev, { food, servings: 1 }];
    });
  };

  const updateServing = (foodId: string, delta: number) => {
    setMyPlate(prev =>
      prev
        .map(p => p.food.id === foodId ? { ...p, servings: p.servings + delta } : p)
        .filter(p => p.servings > 0)
    );
  };

  const removeFromPlate = (foodId: string) => {
    setMyPlate(prev => prev.filter(p => p.food.id !== foodId));
  };

  // Auto-scroll the active pill into view on mobile
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedMachine]);

  useEffect(() => {
    if (programScrollRef.current) {
      const activeEl = programScrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedProgram]);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-bg.png')" }}
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/40"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-primary/10 border-primary/20 text-primary">
              <Zap className="h-3 w-3 mr-1.5" />
              AI-Powered Fitness
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6">
              Transform Your
              <br />
              <span className="gradient-text">Body & Mind</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Get personalized workout plans, real-time AI coaching, nutrition guidance,
              and smart progress tracking — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('workouts')}
                className="h-14 px-8 text-base rounded-xl neon-glow gap-2 font-semibold"
              >
                Start Training
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('ai-coach')}
                className="h-14 px-8 text-base rounded-xl gap-2 font-semibold glass border-white/20 text-foreground hover:bg-white/10"
              >
                <Bot className="h-4 w-4" />
                Try AI Coach
              </Button>
            </div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {[
                { value: '500+', label: 'Exercises' },
                { value: '6', label: 'Gym Machines' },
                { value: '6', label: 'Programs' },
                { value: '50+', label: 'Foods' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-primary/60" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete fitness ecosystem designed to support your journey from day one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full border-border/50">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {iconMap[feature.icon]}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Prime Forge */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Badge variant="secondary" className="mb-4">Why Prime Forge</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Not Just Another <span className="gradient-text">Fitness App</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Prime Forge combines cutting-edge AI with proven fitness methodologies to create
                a truly personalized experience. Our AI Coach learns from your progress and
                adapts your plans in real-time.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Target className="h-5 w-5 text-primary" />, title: 'Personalized Plans', desc: 'AI creates custom workouts based on your goals and fitness level' },
                  { icon: <TrendingUp className="h-5 w-5 text-primary" />, title: 'Adaptive Training', desc: 'Plans evolve as you progress, ensuring continuous improvement' },
                  { icon: <Flame className="h-5 w-5 text-primary" />, title: 'Motivation System', desc: 'Daily challenges, streaks, and AI-powered encouragement' },
                  { icon: <Shield className="h-5 w-5 text-primary" />, title: 'Expert Guidance', desc: 'Built by certified trainers and sports scientists' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden neon-glow">
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/workout-strength.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Card className="glass">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Today&apos;s Workout</p>
                          <p className="text-xs text-muted-foreground">Upper Body Strength</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">85%</p>
                          <p className="text-xs text-muted-foreground">Complete</p>
                        </div>
                      </div>
                      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: '85%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Use Machines */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10 sm:mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <Badge variant="secondary" className="mb-4">
              <Cpu className="h-3 w-3 mr-1" />
              Machine Guides
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How to Use <span className="gradient-text">Gym Machines</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Step-by-step guides for the most popular gym machines. Learn proper form,
              avoid common mistakes, and get the most out of every exercise.
            </p>
          </motion.div>

          {/* Horizontal Machine Selector */}
          <div className="mb-6 sm:mb-8">
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:hidden snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {machineGuides.map((machine) => (
                <button
                  key={machine.id}
                  data-active={selectedMachine === machine.id}
                  onClick={() => { setSelectedMachine(machine.id); setActiveTab('steps'); }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border whitespace-nowrap transition-all duration-300 snap-start shrink-0 ${
                    selectedMachine === machine.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 neon-glow scale-105'
                      : 'bg-card border-border/50 hover:border-primary/40 active:scale-95'
                  }`}
                >
                  <span className="text-lg">{machineIcons[machine.name] || '🏋️'}</span>
                  <span className="text-sm font-semibold">{machine.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <div className="hidden lg:flex flex-wrap items-center justify-center gap-2">
              {machineGuides.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => { setSelectedMachine(machine.id); setActiveTab('steps'); }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                    selectedMachine === machine.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-md neon-glow'
                      : 'bg-card border-border/50 hover:border-primary/40 hover:bg-muted/30'
                  }`}
                >
                  <span className="text-base">{machineIcons[machine.name] || '🏋️'}</span>
                  <span className="text-sm font-semibold">{machine.name}</span>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${
                    selectedMachine === machine.id
                      ? 'border-primary-foreground/30 text-primary-foreground'
                      : difficultyColor[machine.difficulty]
                  }`}>
                    {machine.difficulty}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Machine Counter / Progress dots (mobile) */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <button
              onClick={() => {
                const prev = (machineIndex - 1 + machineGuides.length) % machineGuides.length;
                setSelectedMachine(machineGuides[prev].id);
                setActiveTab('steps');
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {machineGuides.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMachine(m.id); setActiveTab('steps'); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === machineIndex
                      ? 'w-6 h-2 bg-primary'
                      : 'w-2 h-2 bg-muted-foreground/20 hover:bg-muted-foreground/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => {
                const next = (machineIndex + 1) % machineGuides.length;
                setSelectedMachine(machineGuides[next].id);
                setActiveTab('steps');
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground ml-2 font-medium">
              {machineIndex + 1}/{machineGuides.length}
            </span>
          </div>

          {/* Machine Detail Content */}
          <AnimatePresence mode="wait">
            {activeMachine && (
              <motion.div
                key={activeMachine.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
                  <div className="lg:col-span-2">
                    <div className="relative rounded-2xl overflow-hidden group">
                      <div
                        className="aspect-[4/3] lg:aspect-[3/4] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${activeMachine.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-primary text-primary-foreground text-xs backdrop-blur-sm">
                          {activeMachine.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs backdrop-blur-sm bg-background/70 ${difficultyColor[activeMachine.difficulty]}`}>
                          {activeMachine.difficulty}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{machineIcons[activeMachine.name] || '🏋️'}</span>
                          <h3 className="text-xl sm:text-2xl font-bold">{activeMachine.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{activeMachine.muscleGroup}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-1 p-1 mb-4 bg-muted/50 rounded-xl overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {[
                        { key: 'steps', label: 'Steps', icon: <ListOrdered className="h-3.5 w-3.5" /> },
                        { key: 'mistakes', label: 'Mistakes', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
                        { key: 'protip', label: 'Pro Tip', icon: <Lightbulb className="h-3.5 w-3.5" /> },
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                            activeTab === tab.key
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {tab.icon}
                          <span className="hidden sm:inline">{tab.label}</span>
                          {tab.key === 'mistakes' && (
                            <span className={`ml-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                              activeTab === 'mistakes' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                            }`}>
                              {activeMachine.commonMistakes.length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {activeTab === 'steps' && (
                          <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
                              <Settings className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <div>
                                <h4 className="font-semibold text-xs sm:text-sm text-primary mb-1">Quick Setup</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{activeMachine.setup}</p>
                              </div>
                            </div>
                            <div className="space-y-2.5">
                              {activeMachine.steps.map((step, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.06 }}
                                  className="flex gap-3 items-start p-3 sm:p-4 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-colors"
                                >
                                  <div className="relative shrink-0">
                                    <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                      {i + 1}
                                    </span>
                                    {i < activeMachine.steps.length - 1 && (
                                      <div className="absolute left-1/2 top-full -translate-x-1/2 w-px h-3 bg-primary/20 mt-1" />
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 sm:pt-1.5">{step}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeTab === 'mistakes' && (
                          <div className="space-y-2.5">
                            {activeMachine.commonMistakes.map((mistake, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex gap-3 items-start p-3 sm:p-4 rounded-xl bg-destructive/5 border border-destructive/15 hover:border-destructive/30 transition-colors"
                              >
                                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 sm:pt-1.5">{mistake}</p>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {activeTab === 'protip' && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                              <div className="relative">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                    <Lightbulb className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-sm sm:text-base text-primary">Pro Tip</h4>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">{activeMachine.name}</p>
                                  </div>
                                </div>
                                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-medium">
                                  {activeMachine.proTip}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="hidden lg:flex items-center gap-4 mt-5 p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ListOrdered className="h-3 w-3" />
                        <span>{activeMachine.steps.length} steps</span>
                      </div>
                      <div className="w-px h-3 bg-border" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{activeMachine.commonMistakes.length} common mistakes</span>
                      </div>
                      <div className="w-px h-3 bg-border" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Target className="h-3 w-3" />
                        <span>{activeMachine.muscleGroup}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ===== REDESIGNED WORKOUT PROGRAMS ===== */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <Badge variant="secondary" className="mb-4">
              <Calendar className="h-3 w-3 mr-1" />
              Programs
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Choose Your <span className="gradient-text">Workout Program</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professionally designed programs for every fitness level. Each includes a full weekly
              schedule with progressive structure.
            </p>
          </motion.div>

          {/* Mobile: Horizontal scrollable program carousel */}
          <div className="lg:hidden mb-6">
            <div
              ref={programScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {workoutPrograms.map((program, i) => (
                <motion.div
                  key={program.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="snap-start shrink-0 w-[280px]"
                >
                  <button
                    onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                    className="w-full text-left"
                  >
                    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                      selectedProgram === program.id
                        ? `border-primary shadow-lg shadow-primary/10 ${levelBorder[program.level]}`
                        : 'border-transparent'
                    }`}>
                      {/* Program Image */}
                      <div
                        className="h-36 bg-cover bg-center relative"
                        style={{ backgroundImage: `url('${program.image}')` }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-t ${levelGradient[program.level]} to-background/90`} />
                        <div className="absolute top-3 left-3">
                          <Badge variant="outline" className={`text-[10px] backdrop-blur-sm bg-background/80 ${levelColor[program.level]}`}>
                            {program.level}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="text-3xl">{programEmojis[program.name] || '💪'}</span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-bold text-base leading-tight">{program.name}</h3>
                        </div>
                      </div>

                      {/* Program Info */}
                      <div className="p-3.5 bg-card">
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">
                          {program.description}
                        </p>
                        <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {program.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {program.daysPerWeek}d/wk
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {program.highlights.slice(0, 3).map(h => (
                            <Badge key={h} variant="secondary" className="text-[9px] px-1.5 py-0">{h}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Desktop: Program Cards Grid */}
          <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {workoutPrograms.map((program, i) => (
              <motion.div
                key={program.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <button
                  onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                  className="w-full text-left"
                >
                  <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 border-2 group ${
                    selectedProgram === program.id
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : 'border-transparent hover:border-border/50'
                  }`}>
                    <div
                      className="h-44 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${program.image}')` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-t ${levelGradient[program.level]} to-background/90`} />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs backdrop-blur-sm bg-background/80 ${levelColor[program.level]}`}>
                          {program.level}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <motion.span
                          className="text-4xl block"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          {programEmojis[program.name] || '💪'}
                        </motion.span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-lg">{program.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{program.goal}</p>
                      </div>
                    </div>
                    <div className="p-5 bg-card">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {program.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {program.duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {program.daysPerWeek} days/week
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5" /> {program.goal.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {program.highlights.map(h => (
                          <Badge key={h} variant="secondary" className="text-[10px] px-2 py-0">{h}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Program Schedule Detail */}
          <AnimatePresence mode="wait">
            {activeProgram ? (
              <motion.div
                key={activeProgram.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="rounded-2xl border border-primary/20 overflow-hidden bg-gradient-to-br from-card via-card to-muted/20">
                  {/* Schedule Header */}
                  <div className="p-5 sm:p-6 border-b border-border/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <motion.span
                          className="text-3xl sm:text-4xl"
                          initial={{ rotate: -10 }}
                          animate={{ rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {programEmojis[activeProgram.name] || '💪'}
                        </motion.span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold">{activeProgram.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{activeProgram.description}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate('workouts')}
                        className="neon-glow gap-1 shrink-0"
                      >
                        Start
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {activeProgram.highlights.map((h, i) => (
                        <motion.div
                          key={h}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Badge variant="secondary" className="text-xs">{h}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Days */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {activeProgram.schedule.map((day, i) => (
                        <motion.div
                          key={day.day}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07, duration: 0.3 }}
                          className="group"
                        >
                          <div className="rounded-xl border border-border/50 p-4 bg-background/80 hover:bg-background hover:border-primary/20 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {day.day.slice(0, 2)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm">{day.day}</h4>
                                </div>
                              </div>
                              <Badge className={`text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0`}>
                                {day.focus}
                              </Badge>
                            </div>
                            <div className="space-y-1.5">
                              {day.exercises.map((ex, j) => (
                                <motion.div
                                  key={j}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.07 + j * 0.04 }}
                                  className="flex items-start gap-2 text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors"
                                >
                                  <div className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                                  <span className="leading-relaxed">{ex}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      {/* ===== FOOD CALCULATOR ===== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10 sm:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <Badge variant="secondary" className="mb-4">
              <Apple className="h-3 w-3 mr-1" />
              Nutrition
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Food <span className="gradient-text">Calculator</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Search foods, track your daily nutrition, and see your macro breakdown in real-time.
            </p>
          </motion.div>

          {/* Mobile: Full-width stack with floating plate toggle */}
          <div className="lg:hidden space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search foods... (e.g., chicken, rice, banana)"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="pl-10 h-12 rounded-2xl bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary text-sm"
              />
              {foodSearch && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={() => setFoodSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
            </div>

            {/* Category Pills - horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {Object.entries(foodCategoryConfig).map(([key, config]) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFoodCategory(key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0 border ${
                    foodCategory === key
                      ? `${config.color} border-current/20 shadow-sm`
                      : 'bg-card/60 text-muted-foreground border-transparent hover:bg-muted/50'
                  }`}
                >
                  {config.icon}
                  <span className="hidden sm:inline">{config.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Floating Plate Summary Bar */}
            {myPlate.length > 0 && (
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <button
                  onClick={() => setShowMyPlate(!showMyPlate)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 active:scale-[0.99] transition-transform"
                >
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
                      <Utensils className="h-4.5 w-4.5" />
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary text-[10px] font-bold shadow-sm"
                      key={myPlate.length}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {myPlate.length}
                    </motion.div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold">My Plate</p>
                    <p className="text-[11px] text-primary-foreground/80">{plateTotals.calories} kcal &middot; P {plateTotals.protein}g &middot; C {plateTotals.carbs}g &middot; F {plateTotals.fat}g</p>
                  </div>
                  <motion.div
                    animate={{ rotate: showMyPlate ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </motion.div>
                </button>
              </motion.div>
            )}

            {/* Expanded Plate Detail (mobile) */}
            <AnimatePresence>
              {showMyPlate && myPlate.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden">
                    {/* Mini Macro Bars */}
                    <div className="p-4 space-y-2.5 border-b border-border/30">
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <motion.p className="text-2xl font-black text-primary" key={plateTotals.calories} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                            {plateTotals.calories}
                          </motion.p>
                          <p className="text-[10px] text-muted-foreground font-medium">kcal</p>
                        </div>
                        <div className="h-10 w-px bg-border/50" />
                        <div className="flex gap-4">
                          {[
                            { label: 'Protein', value: plateTotals.protein, unit: 'g', pct: macroPercent.protein, color: 'bg-red-400' },
                            { label: 'Carbs', value: plateTotals.carbs, unit: 'g', pct: macroPercent.carbs, color: 'bg-amber-400' },
                            { label: 'Fat', value: plateTotals.fat, unit: 'g', pct: macroPercent.fat, color: 'bg-yellow-400' },
                          ].map(m => (
                            <div key={m.label} className="text-center">
                              <p className="text-sm font-bold">{m.value}{m.unit}</p>
                              <p className="text-[10px] text-muted-foreground">{m.pct}%</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Combined macro bar */}
                      <div className="h-2.5 bg-muted/60 rounded-full overflow-hidden flex">
                        <motion.div className="bg-red-400 rounded-l-full" animate={{ width: `${macroPercent.protein}%` }} transition={{ duration: 0.5 }} />
                        <motion.div className="bg-amber-400" animate={{ width: `${macroPercent.carbs}%` }} transition={{ duration: 0.5, delay: 0.1 }} />
                        <motion.div className="bg-yellow-400 rounded-r-full" animate={{ width: `${macroPercent.fat}%` }} transition={{ duration: 0.5, delay: 0.2 }} />
                      </div>
                    </div>

                    {/* Plate Items */}
                    <div className="max-h-[260px] overflow-y-auto">
                      <AnimatePresence mode="popLayout">
                        {myPlate.map((item, i) => (
                          <motion.div
                            key={item.food.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, height: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.03 }}
                            className="flex items-center gap-3 px-4 py-3 border-b border-border/20 last:border-0"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-lg shrink-0">
                              {item.food.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.food.name}</p>
                              <p className="text-[11px] text-muted-foreground">{Math.round(item.food.calories * item.servings)} cal &middot; {Math.round(item.food.protein * item.servings)}P &middot; {Math.round(item.food.carbs * item.servings)}C &middot; {Math.round(item.food.fat * item.servings)}F</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button onClick={(e) => { e.stopPropagation(); updateServing(item.food.id, -0.5); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors active:scale-90">
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-bold w-6 text-center">{item.servings}</span>
                              <button onClick={(e) => { e.stopPropagation(); updateServing(item.food.id, 0.5); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors active:scale-90">
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Clear button */}
                    <div className="p-3 border-t border-border/30">
                      <Button variant="ghost" size="sm" onClick={() => { setMyPlate([]); setShowMyPlate(false); }} className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 text-xs h-9 gap-1.5">
                        <Trash2 className="h-3 w-3" /> Clear Plate
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Food Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              <AnimatePresence mode="popLayout">
                {filteredFoods.map((food, i) => {
                  const inPlate = myPlate.find(p => p.food.id === food.id);
                  return (
                    <motion.button
                      key={food.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.015, duration: 0.2 }}
                      onClick={() => addToPlate(food)}
                      whileTap={{ scale: 0.97 }}
                      className={`group flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 ${
                        inPlate
                          ? 'border-primary/30 bg-primary/[0.06] shadow-sm shadow-primary/5'
                          : 'border-border/30 bg-card/70 hover:border-primary/15 hover:bg-muted/20 active:border-primary/25'
                      }`}
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl shrink-0 transition-colors ${
                        inPlate ? 'bg-primary/10' : 'bg-muted/60 group-hover:bg-muted'
                      }`}>
                        {food.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-[13px] truncate">{food.name}</h4>
                          {inPlate ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                              {inPlate.servings}x
                            </motion.div>
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-muted-foreground/25 text-muted-foreground/30 group-hover:border-primary/40 group-hover:text-primary/60 transition-colors shrink-0">
                              <Plus className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                          <span className="text-foreground/80 font-semibold">{food.calories}</span>
                          <span className="text-red-400/80">{food.protein}P</span>
                          <span className="text-amber-400/80">{food.carbs}C</span>
                          <span className="text-yellow-400/80">{food.fat}F</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {filteredFoods.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center py-14">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Search className="h-8 w-8 text-muted-foreground/20" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-3">No foods found</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Empty state (no plate items) */}
            {myPlate.length === 0 && (
              <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground/50">
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Utensils className="h-3.5 w-3.5" />
                </motion.div>
                Tap foods above to add them to your plate
              </div>
            )}
          </div>

          {/* Desktop: Side-by-side layout */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-6">
            {/* Food Browser - wider */}
            <div className="lg:col-span-3 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search foods... (e.g., chicken, rice, banana)"
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  className="pl-11 h-12 rounded-2xl bg-card/80 border-border/50 focus:border-primary text-sm"
                />
                {foodSearch && (
                  <button
                    onClick={() => setFoodSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 flex-wrap">
                {Object.entries(foodCategoryConfig).map(([key, config]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFoodCategory(key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                      foodCategory === key
                        ? `${config.color} border-current/20 shadow-sm`
                        : 'bg-card/60 text-muted-foreground border-transparent hover:bg-muted/50'
                    }`}
                  >
                    {config.icon}
                    {config.label}
                  </motion.button>
                ))}
              </div>

              {/* Food Grid */}
              <div className="grid grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                <AnimatePresence mode="popLayout">
                  {filteredFoods.map((food, i) => {
                    const inPlate = myPlate.find(p => p.food.id === food.id);
                    return (
                      <motion.button
                        key={food.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.015, duration: 0.2 }}
                        onClick={() => addToPlate(food)}
                        whileTap={{ scale: 0.97 }}
                        className={`group flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 ${
                          inPlate
                            ? 'border-primary/30 bg-primary/[0.06] shadow-sm shadow-primary/5'
                            : 'border-border/30 bg-card/70 hover:border-primary/15 hover:bg-muted/20'
                        }`}
                      >
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl shrink-0 transition-colors ${
                          inPlate ? 'bg-primary/10' : 'bg-muted/60 group-hover:bg-muted'
                        }`}>
                          {food.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-[13px] truncate">{food.name}</h4>
                            {inPlate ? (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                                {inPlate.servings}x
                              </motion.div>
                            ) : (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-muted-foreground/25 text-muted-foreground/30 group-hover:border-primary/40 group-hover:text-primary/60 transition-colors shrink-0">
                                <Plus className="h-2.5 w-2.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                            <span className="text-foreground/80 font-semibold">{food.calories}</span>
                            <span className="text-red-400/80">{food.protein}P</span>
                            <span className="text-amber-400/80">{food.carbs}C</span>
                            <span className="text-yellow-400/80">{food.fat}F</span>
                            <span className="text-muted-foreground/50 ml-auto">{food.servingSize}</span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
                {filteredFoods.length === 0 && (
                  <div className="col-span-2 flex flex-col items-center justify-center py-14">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                      <Search className="h-8 w-8 text-muted-foreground/20" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mt-3">No foods found</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>

            {/* My Plate - sticky sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-4">
                <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="p-5 border-b border-border/30 bg-gradient-to-r from-primary/[0.04] to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Utensils className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">My Plate</h3>
                          <p className="text-[11px] text-muted-foreground">{myPlate.length} food{myPlate.length !== 1 ? 's' : ''} &middot; {plateTotals.calories} kcal</p>
                        </div>
                      </div>
                      {myPlate.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setMyPlate([])} className="text-destructive hover:text-destructive hover:bg-destructive/5 h-8 px-2.5 text-xs gap-1">
                          <Trash2 className="h-3 w-3" /> Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Calorie Ring + Macros */}
                  <div className="p-5">
                    <div className="flex items-center gap-5">
                      {/* Ring */}
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/40" strokeWidth="7" />
                          <motion.circle
                            cx="50" cy="50" r="42" fill="none"
                            stroke="url(#calorieGrad)" strokeWidth="7" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            animate={{
                              strokeDashoffset: myPlate.length > 0
                                ? 2 * Math.PI * 42 * (1 - Math.min(plateTotals.calories / 2000, 1))
                                : 2 * Math.PI * 42
                            }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                          <defs>
                            <linearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="hsl(var(--primary))" />
                              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span className="text-xl font-black" key={plateTotals.calories} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                            {plateTotals.calories}
                          </motion.span>
                          <span className="text-[9px] text-muted-foreground font-medium">/ 2,000</span>
                        </div>
                      </div>

                      {/* Macro Cards */}
                      <div className="flex-1 space-y-2.5">
                        {[
                          { label: 'Protein', value: plateTotals.protein, pct: macroPercent.protein, color: 'from-red-400 to-rose-500', dot: 'bg-red-400', goal: 150 },
                          { label: 'Carbs', value: plateTotals.carbs, pct: macroPercent.carbs, color: 'from-amber-400 to-orange-500', dot: 'bg-amber-400', goal: 250 },
                          { label: 'Fat', value: plateTotals.fat, pct: macroPercent.fat, color: 'from-yellow-400 to-amber-500', dot: 'bg-yellow-400', goal: 65 },
                        ].map((m) => (
                          <div key={m.label}>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="flex items-center gap-1.5 font-medium">
                                <span className={`w-2 h-2 rounded-full ${m.dot}`} />
                                {m.label}
                              </span>
                              <span className="text-muted-foreground">
                                <span className="font-bold text-foreground text-sm">{m.value}g</span>
                                <span className="ml-1 text-[11px]">{m.pct}%</span>
                              </span>
                            </div>
                            <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${m.color} rounded-full`}
                                animate={{ width: `${Math.min(m.pct, 100)}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Combined mini bar */}
                    <div className="mt-4 h-1.5 bg-muted/40 rounded-full overflow-hidden flex">
                      <motion.div className="bg-red-400" animate={{ width: `${macroPercent.protein}%` }} transition={{ duration: 0.5 }} />
                      <motion.div className="bg-amber-400" animate={{ width: `${macroPercent.carbs}%` }} transition={{ duration: 0.5, delay: 0.1 }} />
                      <motion.div className="bg-yellow-400" animate={{ width: `${macroPercent.fat}%` }} transition={{ duration: 0.5, delay: 0.2 }} />
                    </div>
                  </div>

                  {/* Plate Items */}
                  {myPlate.length > 0 && (
                    <div className="border-t border-border/30 max-h-[280px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                      <AnimatePresence mode="popLayout">
                        {myPlate.map((item, i) => (
                          <motion.div
                            key={item.food.id}
                            layout
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15, height: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                            className="flex items-center gap-3 px-5 py-3 border-b border-border/20 last:border-0 group/item"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 text-base shrink-0">
                              {item.food.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium truncate">{item.food.name}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {Math.round(item.food.calories * item.servings)} cal &middot; {Math.round(item.food.protein * item.servings)}P &middot; {Math.round(item.food.carbs * item.servings)}C &middot; {Math.round(item.food.fat * item.servings)}F
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={(e) => { e.stopPropagation(); updateServing(item.food.id, -0.5); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40 hover:bg-muted transition-colors active:scale-90">
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-bold w-6 text-center">{item.servings}</span>
                              <button onClick={(e) => { e.stopPropagation(); updateServing(item.food.id, 0.5); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors active:scale-90">
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Empty Plate */}
                  {myPlate.length === 0 && (
                    <div className="p-8 text-center">
                      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 mx-auto mb-3">
                          <Utensils className="h-6 w-6 text-muted-foreground/25" />
                        </div>
                      </motion.div>
                      <p className="text-xs text-muted-foreground/60 font-medium">Click on foods to add them here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/hero-bg.png')" }}
            />
            <div className="hero-overlay absolute inset-0" />
            <div className="relative z-10 text-center py-16 sm:py-24 px-4">
              <h2 className="text-3xl sm:text-5xl font-black mb-4">
                Ready to <span className="gradient-text">Start?</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
                Choose a program, track your food, and let our AI Coach guide you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('workouts')}
                  className="h-14 px-10 text-base rounded-xl neon-glow gap-2 font-semibold"
                >
                  <Dumbbell className="h-4 w-4" />
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('ai-coach')}
                  className="h-14 px-10 text-base rounded-xl gap-2 font-semibold glass border-white/20 text-foreground hover:bg-white/10"
                >
                  <Bot className="h-4 w-4" />
                  Ask AI Coach
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
