library(ggplot2)

# Préparer les données pour les étiquettes max, min et médiane
DD_summary <- DD %>%
  group_by(Typolo) %>%
  summarize(min = min(`Biodéchet T/an`),
            max = max(`Biodéchet T/an`),
            median = median(`Biodéchet T/an`))

# Créer un diagramme à moustache avec ggplot2
p <- ggplot(DD, aes(x = Typolo, y = `Biodéchet T/an`, fill = Typolo)) +
  geom_boxplot(width = 0.5) + # Ajuster l'argument 'width' pour augmenter l'espacement entre les boîtes à moustaches
  stat_boxplot(geom ='errorbar', width=0.5, linetype=1, color="black") + # Ajoute des lignes aux points max et min
  geom_text(data = DD_summary, aes(y = min, label = round(min, 1)), size = 3, vjust = 1.5, hjust = 2.5) + # Ajoute des étiquettes pour les valeurs minimales
  geom_text(data = DD_summary, aes(y = max, label = round(max, 1)), size = 3, vjust = -0.5, hjust = 2) + # Ajoute des étiquettes pour les valeurs maximales
  geom_text(data = DD_summary, aes(y = median, label = round(median, 1)), size = 3, vjust = 0.5, hjust = 2.5) + # Ajoute des étiquettes pour les valeurs médianes
  labs(title = "Diagramme à moustache des biodéchets par typologie",
       x = "Typologie",
       y = "Biodéchet T/an") +
  theme_minimal()

# Afficher le diagramme
print(p)
