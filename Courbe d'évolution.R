# Les données
data <- read.table(text = "
Années Biodéchets Verre OMR Emballages
2001    0   38  0   11
2002    0   39  0   13
2003    30  46  16  27
2004    37  51  25  28
2005    35  50  28  30
2006    33  48  30  30
2007    35  47  32  30
2008    37  46  35  32
2009    38  45  35  30
2010    38  45  35  29
2011    40  44  36  30
2012    40  42  36  27
2013    40  42  39  23", header = TRUE)

# Graphique
plot(data$Années, data$Biodéchets, type = "l", col = "darkgreen", lwd = 2, ylim = c(0, 60), xlab = "Années", ylab = "Quantité (Kg)", main = "Évolution de la récolte des déchets par catégorie", yaxt = "n",xaxt = "n")
lines(data$Années, data$Verre, col = "red", lwd = 2)
lines(data$Années, data$OMR, col = "orange", lwd = 2)
lines(data$Années, data$Emballages, col = "blue", lwd = 2)

# Modifier les graduations de l'axe Y
axis(2, at = seq(0, 70, by = 5), las = 1)
# Modifier les graduations de l'axe X
axis(1, at = seq(2001, 2013, by = 1), las = 1)

# Légende
legend("topright", legend = c("Biodéchets", "Verre", "OMR", "Emballages"), col = c("darkgreen", "red", "orange", "blue"), lty = 1, lwd = 2)
